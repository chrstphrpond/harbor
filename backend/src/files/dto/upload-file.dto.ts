import { IsEnum } from 'class-validator';
import { FileType } from '@prisma/client';

export class UploadFileDto {
  @IsEnum(FileType)
  fileType: FileType;
}
