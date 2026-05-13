// src/applications/dto/query-applications.dto.ts
// src/applications/dto/query-applications.dto.ts
import {
  IsOptional,
  IsEnum,
  IsInt,
  IsString,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ApplicationStatus } from '../../common/enums/application-status.enum';

export class QueryApplicationsDto {
  @ApiPropertyOptional({ description: 'Filter by job slug' }) @IsOptional() @IsString() jobSlug?: string;
  @ApiPropertyOptional({ enum: ApplicationStatus }) @IsOptional() @IsEnum(ApplicationStatus) status?: ApplicationStatus;
  @ApiPropertyOptional({ description: 'Search by applicant name, email, or contact number' }) @IsOptional() @IsString() search?: string;
  @ApiPropertyOptional({ example: 1, minimum: 1 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
  @ApiPropertyOptional({ example: 20, minimum: 1, maximum: 100 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit?: number;
}
