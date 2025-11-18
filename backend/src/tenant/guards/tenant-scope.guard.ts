import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { JwtPayload } from '../../common/types/jwt-payload.type';

/**
 * TenantScopeGuard ensures that requests include a valid tenantId in the JWT
 * This guard should be applied globally or to protected routes
 */
@Injectable()
export class TenantScopeGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;

    if (!user || !user.tenantId) {
      throw new ForbiddenException('Tenant context required');
    }

    // Attach tenantId to request for easy access in controllers
    request.tenantId = user.tenantId;

    return true;
  }
}
