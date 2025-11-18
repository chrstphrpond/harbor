import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantScopeGuard } from '../tenant/guards/tenant-scope.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';
import { AutomationService } from './automation.service';
import { CreateRuleDto } from './dto/create-rule.dto';

@Controller('automation')
@UseGuards(JwtAuthGuard, TenantScopeGuard, RolesGuard)
export class AutomationController {
  constructor(private automationService: AutomationService) {}

  @Get('rules')
  async getRules(@CurrentUser('tenantId') tenantId: string) {
    return this.automationService.getRules(tenantId);
  }

  @Post('rules')
  @Roles(Role.ADMIN, Role.MANAGER)
  async createRule(@CurrentUser('tenantId') tenantId: string, @Body() dto: CreateRuleDto) {
    return this.automationService.createRule(tenantId, dto);
  }

  @Patch('rules/:ruleId')
  @Roles(Role.ADMIN, Role.MANAGER)
  async updateRule(
    @CurrentUser('tenantId') tenantId: string,
    @Param('ruleId') ruleId: string,
    @Body('enabled') enabled: boolean,
  ) {
    return this.automationService.updateRule(tenantId, ruleId, enabled);
  }
}
