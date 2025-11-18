import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRuleDto } from './dto/create-rule.dto';

@Injectable()
export class AutomationService {
  constructor(private prisma: PrismaService) {}

  async getRules(tenantId: string) {
    return this.prisma.automationRule.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getRule(tenantId: string, ruleId: string) {
    return this.prisma.automationRule.findFirst({
      where: { id: ruleId, tenantId },
    });
  }

  async createRule(tenantId: string, dto: CreateRuleDto) {
    return this.prisma.automationRule.create({
      data: {
        tenantId,
        name: dto.name,
        ruleDefinition: dto.ruleDefinition,
        enabled: dto.enabled ?? true,
      },
    });
  }

  async updateRule(tenantId: string, ruleId: string, enabled: boolean) {
    return this.prisma.automationRule.update({
      where: { id: ruleId },
      data: { enabled },
    });
  }
}
