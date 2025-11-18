import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PrismaService } from '../prisma/prisma.service';
import { QueueService } from '../queue/queue.service';
import { FileType } from '@prisma/client';

@Injectable()
export class FilesService {
  private s3Client: S3Client;
  private bucket: string;

  constructor(
    private prisma: PrismaService,
    private queueService: QueueService,
    private configService: ConfigService,
  ) {
    this.s3Client = new S3Client({
      endpoint: this.configService.get('SPACES_ENDPOINT'),
      region: this.configService.get('SPACES_REGION'),
      credentials: {
        accessKeyId: this.configService.get('SPACES_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('SPACES_SECRET_ACCESS_KEY'),
      },
    });
    this.bucket = this.configService.get('SPACES_BUCKET');
  }

  async generatePresignedUploadUrl(tenantId: string, fileType: FileType) {
    // Create raw file record
    const rawFile = await this.prisma.rawFile.create({
      data: {
        tenantId,
        fileType,
        storageUrl: '', // Will be updated after upload
        status: 'PENDING',
      },
    });

    const key = `tenants/${tenantId}/files/${rawFile.id}.csv`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: 'text/csv',
    });

    const presignedUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });

    // Update storage URL
    await this.prisma.rawFile.update({
      where: { id: rawFile.id },
      data: { storageUrl: key },
    });

    return {
      fileId: rawFile.id,
      uploadUrl: presignedUrl,
      expiresIn: 3600,
    };
  }

  async confirmUpload(fileId: string, tenantId: string) {
    const file = await this.prisma.rawFile.findFirst({
      where: { id: fileId, tenantId },
    });

    if (!file) {
      throw new Error('File not found');
    }

    // Enqueue processing job
    await this.queueService.addFileProcessingJob({
      fileId: file.id,
      tenantId: file.tenantId,
    });

    return { message: 'File queued for processing' };
  }

  async getFileHistory(tenantId: string) {
    return this.prisma.rawFile.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fileType: true,
        status: true,
        createdAt: true,
      },
    });
  }
}
