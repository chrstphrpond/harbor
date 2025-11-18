import { Job, Queue } from 'bullmq';
import { PrismaClient } from '@prisma/client';
import { Redis } from 'ioredis';

const prisma = new PrismaClient();
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
});

const emailQueue = new Queue('email', { connection: redis });

interface AutomationJobData {
  tenantId: string;
}

export async function evaluateAutomationsJob(job: Job<AutomationJobData>) {
  const { tenantId } = job.data;

  console.log(`Evaluating automations for tenant ${tenantId}`);

  try {
    // Fetch enabled automation rules
    const rules = await prisma.automationRule.findMany({
      where: {
        tenantId,
        enabled: true,
      },
    });

    console.log(`Found ${rules.length} enabled rules for tenant ${tenantId}`);

    for (const rule of rules) {
      const definition = rule.ruleDefinition as any;

      // Only support drop_percent_greater_than for MVP
      if (definition.condition?.type !== 'drop_percent_greater_than') {
        continue;
      }

      // Compute metric values for current and previous periods
      const currentValue = await computeMetric(
        tenantId,
        definition.metric,
        definition.period.currentDays,
      );

      const previousValue = await computeMetric(
        tenantId,
        definition.metric,
        definition.period.previousDays,
        definition.period.currentDays,
      );

      console.log(
        `Rule "${rule.name}": current=${currentValue}, previous=${previousValue}`,
      );

      // Evaluate condition
      if (previousValue <= 0) {
        continue; // Avoid divide by zero
      }

      const dropPercent = ((previousValue - currentValue) / previousValue) * 100;

      if (dropPercent > definition.condition.threshold) {
        console.log(`Rule "${rule.name}" triggered! Drop: ${dropPercent.toFixed(2)}%`);

        // Get recipients
        const users = await prisma.user.findMany({
          where: {
            tenantId,
            role: definition.action.toRole.toUpperCase(),
          },
          select: { email: true },
        });

        const recipients = users.map((u) => u.email);

        if (recipients.length > 0) {
          // Enqueue email job
          await emailQueue.add('send-email', {
            tenantId,
            recipients,
            subject: definition.action.subject,
            templateId: definition.action.template,
            templateData: {
              metricKey: definition.metric,
              currentValue,
              previousValue,
              dropPercent: dropPercent.toFixed(2),
            },
          });

          console.log(`Email job enqueued for ${recipients.length} recipients`);
        }
      }
    }

    console.log(`Automation evaluation completed for tenant ${tenantId}`);
  } catch (error) {
    console.error(`Error evaluating automations for tenant ${tenantId}:`, error);
    throw error;
  }
}

async function computeMetric(
  tenantId: string,
  metricKey: string,
  days: number,
  offsetDays: number = 0,
): Promise<number> {
  // Simple stub - implement actual metric computation
  // metricKey format: "sales.revenue" or "expenses.total"

  const [recordType] = metricKey.split('.');

  const endDate = new Date();
  endDate.setDate(endDate.getDate() - offsetDays);

  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - days);

  const records = await prisma.processedRecord.count({
    where: {
      tenantId,
      recordType,
      createdAt: {
        gte: startDate,
        lt: endDate,
      },
    },
  });

  return records;
}
