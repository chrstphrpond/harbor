import { Job } from 'bullmq';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { parse } from 'csv-parse/sync';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const s3Client = new S3Client({
  endpoint: process.env.SPACES_ENDPOINT,
  region: process.env.SPACES_REGION,
  credentials: {
    accessKeyId: process.env.SPACES_ACCESS_KEY_ID!,
    secretAccessKey: process.env.SPACES_SECRET_ACCESS_KEY!,
  },
});

interface FileProcessingJobData {
  fileId: string;
  tenantId: string;
}

export async function processFileJob(job: Job<FileProcessingJobData>) {
  const { fileId, tenantId } = job.data;

  console.log(`Processing file ${fileId} for tenant ${tenantId}`);

  try {
    // Fetch file metadata
    const rawFile = await prisma.rawFile.findUnique({
      where: { id: fileId },
    });

    if (!rawFile) {
      throw new Error(`File ${fileId} not found`);
    }

    // Download CSV from storage
    const command = new GetObjectCommand({
      Bucket: process.env.SPACES_BUCKET!,
      Key: rawFile.storageUrl,
    });

    const response = await s3Client.send(command);
    const csvContent = await response.Body?.transformToString();

    if (!csvContent) {
      throw new Error('Failed to download file content');
    }

    // Parse CSV
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
    });

    console.log(`Parsed ${records.length} records from file ${fileId}`);

    // Save processed records
    const recordType = rawFile.fileType.toLowerCase();

    for (const record of records) {
      await prisma.processedRecord.create({
        data: {
          tenantId,
          recordType,
          data: record,
        },
      });
    }

    // Update file status
    await prisma.rawFile.update({
      where: { id: fileId },
      data: { status: 'PROCESSED' },
    });

    console.log(`File ${fileId} processed successfully`);
  } catch (error) {
    console.error(`Error processing file ${fileId}:`, error);

    // Mark file as failed
    await prisma.rawFile.update({
      where: { id: fileId },
      data: { status: 'FAILED' },
    });

    throw error;
  }
}
