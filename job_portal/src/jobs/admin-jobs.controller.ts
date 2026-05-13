import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { AdminOnly } from '../common/decorators/admin-only.decorator';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { QueryJobsDto } from './dto/query-jobs.dto';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';
import { ResponseMessage } from '../common/decorators/response-message.decorator';

@ApiTags('Admin - Jobs')
@ApiBearerAuth()
@Controller('admin/jobs')
export class AdminJobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  @AdminOnly()
  @ResponseMessage('Jobs fetched successfully')
  @ApiOperation({ summary: 'List jobs (admin, paginated, searchable)' })
  @ApiResponse({ status: 200, description: 'Paginated jobs including inactive' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@Query() query: QueryJobsDto) {
    return this.jobsService.findAllAdmin(query);
  }

  @Post()
  @AdminOnly()
  @ResponseMessage('Job created successfully')
  @ApiOperation({ summary: 'Create new job' })
  @ApiResponse({ status: 201, description: 'Job created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createJobDto: CreateJobDto) {
    return this.jobsService.create(createJobDto);
  }

  @Patch(':id')
  @AdminOnly()
  @ResponseMessage('Job updated successfully')
  @ApiOperation({ summary: 'Update job' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  @ApiResponse({ status: 200, description: 'Job updated' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateJobDto: UpdateJobDto,
  ) {
    return this.jobsService.update(id, updateJobDto);
  }

  @Delete(':id')
  @AdminOnly()
  @ResponseMessage('Job deleted successfully')
  @ApiOperation({ summary: 'Soft-delete job' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  @ApiResponse({ status: 200, description: 'Job deactivated' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  softDelete(@Param('id', ParseMongoIdPipe) id: string) {
    return this.jobsService.softDelete(id);
  }
}
