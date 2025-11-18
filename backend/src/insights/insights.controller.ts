import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantScopeGuard } from '../tenant/guards/tenant-scope.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { InsightsService } from './insights.service';
import { InsightType } from '@prisma/client';

@Controller('insights')
@UseGuards(JwtAuthGuard, TenantScopeGuard)
export class InsightsController {
  constructor(private insightsService: InsightsService) {}

  @Get()
  async getInsights(
    @CurrentUser('tenantId') tenantId: string,
    @Query('type') type?: InsightType,
  ) {
    return this.insightsService.getInsights(tenantId, type);
  }
}
