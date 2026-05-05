// src/applications/admin-applications.controller.ts
import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
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
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';
import { ApplicationsService } from './applications.service';
import { UpdateStatusDto } from './dto/update-status.dto';
import { QueryApplicationsDto } from './dto/query-applications.dto';
import { ResponseMessage } from '../common/decorators/response-message.decorator';

@ApiTags('Admin - Applications')
@ApiBearerAuth()
@Controller('admin/applications')
export class AdminApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get()
  @AdminOnly()
  @ResponseMessage('Applications fetched successfully')
  @ApiOperation({ summary: 'List applications (paginated, filterable)' })
  @ApiResponse({ status: 200, description: 'Paginated list of applications' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@Query() query: QueryApplicationsDto) {
    return this.applicationsService.findAll(query);
  }

  @Get(':id')
  @AdminOnly()
  @ResponseMessage('Application fetched successfully')
  @ApiOperation({ summary: 'Get application by ID' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  @ApiResponse({ status: 200, description: 'Application details' })
  @ApiResponse({ status: 404, description: 'Application not found' })
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.applicationsService.findOne(id);
  }

  @Patch(':id/status')
  @AdminOnly()
  @ResponseMessage('Application status updated successfully')
  @ApiOperation({ summary: 'Update application status' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  @ApiResponse({ status: 200, description: 'Status updated' })
  @ApiResponse({ status: 404, description: 'Application not found' })
  updateStatus(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.applicationsService.updateStatus(id, dto);
  }

  @Delete(':id')
  @AdminOnly()
  @ResponseMessage('Application deleted successfully')
  @ApiOperation({ summary: 'Delete application' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  @ApiResponse({ status: 200, description: 'Application deleted' })
  @ApiResponse({ status: 404, description: 'Application not found' })
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.applicationsService.remove(id);
  }
}
