import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async logAction(tenantId: string, userId: string, action: string, payload?: any) {
    return this.prisma.auditLog.create({
      data: {
        tenantId,
        userId,
        action,
        payload,
      },
    });
  }

  async getLogs(tenantId: string, limit = 100) {
    return this.prisma.auditLog.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });
  }
}
