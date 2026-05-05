import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsArray,
  IsOptional,
  ValidateNested,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { JobType } from '../../common/enums/job-type.enum';
import { FieldDefinitionDto } from './field-definition.dto';

export class CreateJobDto {
  @ApiProperty({ example: 'Frontend Developer' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @ApiProperty({ example: 'We are looking for a skilled frontend developer...' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  description: string;

  @ApiProperty({ example: 'Engineering' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  domain: string;

  @ApiProperty({ enum: JobType })
  @IsEnum(JobType)
  type: JobType;

  @ApiPropertyOptional({ example: ['React', 'TypeScript'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  requirements?: string[];

  @ApiPropertyOptional({ type: [FieldDefinitionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FieldDefinitionDto)
  @IsOptional()
  customFields?: FieldDefinitionDto[];
}
