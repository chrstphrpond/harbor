import { Role } from '../enums/role.enum';

export interface JwtPayload {
  sub: string; // userId
  email: string;
  tenantId: string;
  role: Role;
}

export interface RefreshTokenPayload {
  sub: string; // userId
  tokenVersion?: number;
}
