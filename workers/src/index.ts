import { Worker } from 'bullmq';
import { Redis } from 'ioredis';
import * as dotenv from 'dotenv';
import { processFileJob } from './processors/file-processing.processor';
import { generateInsightsJob } from './processors/insights.processor';
import { evaluateAutomationsJob } from './processors/automation.processor';
import { sendEmailJob } from './processors/email.processor';

dotenv.config();

const connection = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
});

// File Processing Worker
const fileProcessingWorker = new Worker('fileProcessing', processFileJob, {
  connection,
  concurrency: 5,
});

fileProcessingWorker.on('completed', (job) => {
  console.log(`✅ File processing job ${job.id} completed`);
});

fileProcessingWorker.on('failed', (job, err) => {
  console.error(`❌ File processing job ${job?.id} failed:`, err.message);
});

// Insights Worker
const insightsWorker = new Worker('insights', generateInsightsJob, {
  connection,
  concurrency: 3,
});

insightsWorker.on('completed', (job) => {
  console.log(`✅ Insights job ${job.id} completed`);
});

insightsWorker.on('failed', (job, err) => {
  console.error(`❌ Insights job ${job?.id} failed:`, err.message);
});

// Automation Worker
const automationWorker = new Worker('automation', evaluateAutomationsJob, {
  connection,
  concurrency: 2,
});

automationWorker.on('completed', (job) => {
  console.log(`✅ Automation job ${job.id} completed`);
});

automationWorker.on('failed', (job, err) => {
  console.error(`❌ Automation job ${job?.id} failed:`, err.message);
});

// Email Worker
const emailWorker = new Worker('email', sendEmailJob, {
  connection,
  concurrency: 10,
});

emailWorker.on('completed', (job) => {
  console.log(`✅ Email job ${job.id} completed`);
});

emailWorker.on('failed', (job, err) => {
  console.error(`❌ Email job ${job?.id} failed:`, err.message);
});

console.log('🔧 Harbor Workers started');
console.log('Workers running:');
console.log('  - File Processing Worker (concurrency: 5)');
console.log('  - Insights Worker (concurrency: 3)');
console.log('  - Automation Worker (concurrency: 2)');
console.log('  - Email Worker (concurrency: 10)');

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down workers...');
  await Promise.all([
    fileProcessingWorker.close(),
    insightsWorker.close(),
    automationWorker.close(),
    emailWorker.close(),
  ]);
  process.exit(0);
});
