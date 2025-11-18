import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

export const QUEUE_NAMES = {
  FILE_PROCESSING: 'fileProcessing',
  INSIGHTS: 'insights',
  AUTOMATION: 'automation',
  EMAIL: 'email',
} as const;

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue(QUEUE_NAMES.FILE_PROCESSING) private fileProcessingQueue: Queue,
    @InjectQueue(QUEUE_NAMES.INSIGHTS) private insightsQueue: Queue,
    @InjectQueue(QUEUE_NAMES.AUTOMATION) private automationQueue: Queue,
    @InjectQueue(QUEUE_NAMES.EMAIL) private emailQueue: Queue,
  ) {}

  async addFileProcessingJob(data: { fileId: string; tenantId: string }) {
    return this.fileProcessingQueue.add('process-file', data);
  }

  async addInsightsJob(data: { tenantId: string; type: 'DAILY' | 'WEEKLY' }) {
    return this.insightsQueue.add('generate-insights', data);
  }

  async addAutomationJob(data: { tenantId: string }) {
    return this.automationQueue.add('evaluate-automations', data);
  }

  async addEmailJob(data: {
    tenantId: string;
    recipients: string[];
    subject: string;
    templateId: string;
    templateData: any;
  }) {
    return this.emailQueue.add('send-email', data);
  }
}
