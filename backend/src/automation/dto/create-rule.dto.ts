import { IsString, IsObject, IsBoolean, IsOptional } from 'class-validator';

export class CreateRuleDto {
  @IsString()
  name: string;

  @IsObject()
  ruleDefinition: any; // JSON object following the automation spec

  @IsBoolean()
  @IsOptional()
  enabled?: boolean;
}
