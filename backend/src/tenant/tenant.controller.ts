import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { TenantScopeGuard } from './guards/tenant-scope.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';
import { TenantService } from './tenant.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('tenant')
@UseGuards(JwtAuthGuard, TenantScopeGuard, RolesGuard)
export class TenantController {
  constructor(private tenantService: TenantService) {}

  @Get('users')
  async getUsers(@CurrentUser('tenantId') tenantId: string) {
    return this.tenantService.getUsers(tenantId);
  }

  @Post('users')
  @Roles(Role.ADMIN)
  async createUser(@CurrentUser('tenantId') tenantId: string, @Body() dto: CreateUserDto) {
    return this.tenantService.createUser(tenantId, dto);
  }
}
