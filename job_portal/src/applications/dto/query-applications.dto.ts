// src/applications/dto/query-applications.dto.ts
import {
  IsOptional,
  IsMongoId,
  IsEnum,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ApplicationStatus } from '../../common/enums/application-status.enum';

export class QueryApplicationsDto {
  @ApiPropertyOptional({ description: 'Filter by job ID' }) @IsOptional() @IsMongoId() jobId?: string;
  @ApiPropertyOptional({ enum: ApplicationStatus }) @IsOptional() @IsEnum(ApplicationStatus) status?: ApplicationStatus;
  @ApiPropertyOptional({ example: 1, minimum: 1 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
  @ApiPropertyOptional({ example: 20, minimum: 1, maximum: 100 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit?: number;
}
