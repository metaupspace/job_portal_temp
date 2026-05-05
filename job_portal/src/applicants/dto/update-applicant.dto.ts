import { IsString, IsEnum, IsOptional, IsUrl, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Experience } from '../../common/enums/experience.enum';

export class UpdateApplicantDto {
  @ApiPropertyOptional() @IsOptional() @IsString() @IsNotEmpty() @MaxLength(200) fullName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @IsNotEmpty() @MaxLength(100) contactNumber?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @IsNotEmpty() @MaxLength(100) whatsappNumber?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @IsNotEmpty() @MaxLength(200) currentLocation?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @IsNotEmpty() @MaxLength(500) linkedinId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @IsNotEmpty() @MaxLength(200) qualification?: string;
  @ApiPropertyOptional({ enum: Experience }) @IsOptional() @IsEnum(Experience) experience?: Experience;
  @ApiPropertyOptional() @IsOptional() @IsUrl() resumeUrl?: string;
}
