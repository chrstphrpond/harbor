import { Job } from 'bullmq';
import { PrismaClient, InsightType } from '@prisma/client';

const prisma = new PrismaClient();

interface InsightsJobData {
  tenantId: string;
  type: InsightType;
}

export async function generateInsightsJob(job: Job<InsightsJobData>) {
  const { tenantId, type } = job.data;

  console.log(`Generating ${type} insights for tenant ${tenantId}`);

  try {
    // Fetch recent processed records
    const daysToAnalyze = type === 'DAILY' ? 1 : 7;
    const since = new Date();
    since.setDate(since.getDate() - daysToAnalyze);

    const salesRecords = await prisma.processedRecord.findMany({
      where: {
        tenantId,
        recordType: 'sales',
        createdAt: { gte: since },
      },
    });

    const expenseRecords = await prisma.processedRecord.findMany({
      where: {
        tenantId,
        recordType: 'expenses',
        createdAt: { gte: since },
      },
    });

    // TODO: Aggregate metrics
    const metrics = {
      totalSales: salesRecords.length,
      totalExpenses: expenseRecords.length,
      period: type === 'DAILY' ? 'last 24 hours' : 'last 7 days',
    };

    // TODO: Call AI provider to generate insights
    // For now, create a simple insight
    const insightContent = {
      summary: `In the ${metrics.period}, you had ${metrics.totalSales} sales transactions and ${metrics.totalExpenses} expense records.`,
      metrics,
      issues: [],
      recommendations: [],
    };

    // Save insight
    await prisma.insight.create({
      data: {
        tenantId,
        type,
        content: insightContent,
      },
    });

    console.log(`${type} insights generated for tenant ${tenantId}`);
  } catch (error) {
    console.error(`Error generating insights for tenant ${tenantId}:`, error);
    throw error;
  }
}
