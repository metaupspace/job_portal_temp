import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsBoolean,
  IsArray,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FieldType } from '../../common/enums/field-type.enum';

export class FieldDefinitionDto {
  @ApiProperty({ example: 'years_experience' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  fieldId: string;

  @ApiProperty({ example: 'Years of Experience' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  label: string;

  @ApiProperty({ enum: FieldType })
  @IsEnum(FieldType)
  fieldType: FieldType;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  required?: boolean;

  @ApiPropertyOptional({ example: ['option1', 'option2'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  options?: string[];
}
