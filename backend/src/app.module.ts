import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { QueueModule } from './queue/queue.module';
import { AuthModule } from './auth/auth.module';
import { TenantModule } from './tenant/tenant.module';
import { FilesModule } from './files/files.module';
import { DataModule } from './data/data.module';
import { InsightsModule } from './insights/insights.module';
import { AutomationModule } from './automation/automation.module';
import { AuditModule } from './audit/audit.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    QueueModule,
    AuthModule,
    TenantModule,
    FilesModule,
    DataModule,
    InsightsModule,
    AutomationModule,
    AuditModule,
  ],
})
export class AppModule {}
