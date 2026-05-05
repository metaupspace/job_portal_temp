import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { isValidObjectId } from 'mongoose';
import { JobsService } from './jobs.service';
import { ResponseMessage } from '../common/decorators/response-message.decorator';

@ApiTags('Jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  @ResponseMessage('Jobs fetched successfully')
  @ApiOperation({ summary: 'List all active jobs' })
  @ApiResponse({ status: 200, description: 'Array of active job listings' })
  findAllActive() {
    return this.jobsService.findAllActive();
  }

  @Get(':identifier')
  @ResponseMessage('Job fetched successfully')
  @ApiOperation({ summary: 'Get active job by ID or slug' })
  @ApiParam({ name: 'identifier', description: 'MongoDB ObjectId or job slug', example: 'frontend-developer-lx3k9z' })
  @ApiResponse({ status: 200, description: 'Job details' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  findOne(@Param('identifier') identifier: string) {
    if (isValidObjectId(identifier)) {
      return this.jobsService.findOneActive(identifier);
    }
    return this.jobsService.findBySlug(identifier);
  }
}
