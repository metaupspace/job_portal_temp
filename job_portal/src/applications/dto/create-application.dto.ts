// src/applications/dto/create-application.dto.ts
import {
  IsString,
  IsEmail,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsObject,
  IsNotEmpty,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Experience } from '../../common/enums/experience.enum';
import { HearAboutUs } from '../../common/enums/hear-about-us.enum';

export class CreateApplicationDto {
  @ApiProperty({ example: 'Jane Doe' }) @IsString() @IsNotEmpty() @MaxLength(200) fullName: string;
  @ApiProperty({ example: 'jane@example.com' }) @IsEmail() email: string;
  @ApiProperty({ example: '+91-9876543210' }) @IsString() @IsNotEmpty() @MaxLength(100) contactNumber: string;
  @ApiProperty({ example: '+91-9876543210' }) @IsString() @IsNotEmpty() @MaxLength(100) whatsappNumber: string;
  @ApiProperty({ example: 'Mumbai, India' }) @IsString() @IsNotEmpty() @MaxLength(200) currentLocation: string;
  @ApiProperty({ example: 'https://linkedin.com/in/janedoe' }) @IsString() @IsNotEmpty() @MaxLength(500) linkedinId: string;
  @ApiProperty({ example: 'B.Tech Computer Science' }) @IsString() @IsNotEmpty() @MaxLength(200) qualification: string;
  @ApiProperty({ enum: Experience }) @IsEnum(Experience) experience: Experience;
  @ApiProperty({ example: true }) @IsBoolean() comfortableFlexibleShifts: boolean;
  @ApiProperty({ example: '8 LPA' }) @IsString() @IsNotEmpty() @MaxLength(100) lastSalary: string;
  @ApiProperty({ example: '30 days' }) @IsString() @IsNotEmpty() @MaxLength(100) noticePeriod: string;
  @ApiPropertyOptional({ example: 'John Smith' }) @IsOptional() @IsString() @MaxLength(200) referredBy?: string;
  @ApiProperty({ enum: HearAboutUs }) @IsEnum(HearAboutUs) hearAboutUs: HearAboutUs;
  @ApiProperty({ example: 'https://res.cloudinary.com/demo/resume.pdf' }) @IsUrl() resumeUrl: string;
  @ApiProperty({ example: 'I have 3 years of React experience...' }) @IsString() @IsNotEmpty() @MaxLength(5000) whyGoodFit: string;
  @ApiProperty({ example: 'I want to grow with a startup...' }) @IsString() @IsNotEmpty() @MaxLength(5000) whyJoinUs: string;

  // Tech-only — conditionally required at service layer
  @ApiPropertyOptional({ example: 'https://github.com/janedoe' }) @IsOptional() @IsString() @IsNotEmpty() @MaxLength(500) githubId?: string;
  @ApiPropertyOptional({ example: 'https://janedoe.dev' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  portfolioLink?: string;
  @ApiPropertyOptional({ example: 'React, TypeScript, Node.js' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  technologiesKnown?: string;
  @ApiPropertyOptional({ example: 'Built a distributed caching layer...' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  hardestProblem?: string;

  @ApiPropertyOptional({ type: 'object', additionalProperties: true }) @IsOptional() @IsObject() customResponses?: Record<string, unknown>;
}
