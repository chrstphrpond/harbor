import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InsightType } from '@prisma/client';

@Injectable()
export class InsightsService {
  constructor(private prisma: PrismaService) {}

  async getInsights(tenantId: string, type?: InsightType) {
    return this.prisma.insight.findMany({
      where: {
        tenantId,
        ...(type && { type }),
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async getLatestInsight(tenantId: string, type: InsightType) {
    return this.prisma.insight.findFirst({
      where: {
        tenantId,
        type,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
