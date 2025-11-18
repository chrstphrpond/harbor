import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantScopeGuard } from '../tenant/guards/tenant-scope.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { FilesService } from './files.service';
import { UploadFileDto } from './dto/upload-file.dto';

@Controller('files')
@UseGuards(JwtAuthGuard, TenantScopeGuard)
export class FilesController {
  constructor(private filesService: FilesService) {}

  @Post('upload')
  async getUploadUrl(@CurrentUser('tenantId') tenantId: string, @Body() dto: UploadFileDto) {
    return this.filesService.generatePresignedUploadUrl(tenantId, dto.fileType);
  }

  @Post('upload/:fileId/confirm')
  async confirmUpload(@CurrentUser('tenantId') tenantId: string, @Param('fileId') fileId: string) {
    return this.filesService.confirmUpload(fileId, tenantId);
  }

  @Get('history')
  async getHistory(@CurrentUser('tenantId') tenantId: string) {
    return this.filesService.getFileHistory(tenantId);
  }
}
