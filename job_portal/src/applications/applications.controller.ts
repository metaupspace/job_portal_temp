// src/applications/applications.controller.ts
import { Controller, Post, Get, Param, Body, Query } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { CheckStatusDto } from './dto/check-status.dto';
import { ResponseMessage } from '../common/decorators/response-message.decorator';

@ApiTags('Applications')
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get('status')
  @ResponseMessage('Applications fetched successfully')
  @ApiOperation({ summary: 'List all applications for an email address' })
  @ApiQuery({ name: 'email', description: 'Email used during application' })
  @ApiResponse({ status: 200, description: 'All applications for this email' })
  findByEmail(@Query() query: CheckStatusDto) {
    return this.applicationsService.findByEmail(query.email);
  }

  @Get(':id/status')
  @ResponseMessage('Application status fetched successfully')
  @ApiOperation({ summary: 'Check application status by ID + email' })
  @ApiParam({ name: 'id', description: 'Application ID returned on submission' })
  @ApiQuery({ name: 'email', description: 'Email used during application' })
  @ApiResponse({ status: 200, description: 'Application status' })
  @ApiResponse({ status: 404, description: 'Application not found or email mismatch' })
  checkStatus(
    @Param('id', ParseMongoIdPipe) id: string,
    @Query() query: CheckStatusDto,
  ) {
    return this.applicationsService.checkStatus(id, query.email);
  }

  @Post(':jobIdentifier')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ResponseMessage('Application submitted successfully')
  @ApiOperation({ summary: 'Submit application for a job' })
  @ApiParam({ name: 'jobIdentifier', description: 'Job ID or slug', example: 'frontend-developer-lx3k9z' })
  @ApiResponse({ status: 201, description: 'Application submitted' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  create(
    @Param('jobIdentifier') jobIdentifier: string,
    @Body() dto: CreateApplicationDto,
  ) {
    return this.applicationsService.create(jobIdentifier, dto);
  }
}
