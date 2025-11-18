import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantScopeGuard } from '../tenant/guards/tenant-scope.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { DataService } from './data.service';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, TenantScopeGuard)
export class DataController {
  constructor(private dataService: DataService) {}

  @Get('metrics')
  async getMetrics(@CurrentUser('tenantId') tenantId: string) {
    return this.dataService.getDashboardMetrics(tenantId);
  }
}
