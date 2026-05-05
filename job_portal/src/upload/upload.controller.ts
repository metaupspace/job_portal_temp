import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { Throttle } from '@nestjs/throttler';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { ResponseMessage } from '../common/decorators/response-message.decorator';

const ALLOWED_MIMETYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('resume')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ResponseMessage('Resume uploaded successfully')
  @ApiOperation({ summary: 'Upload resume (PDF or Word, max 10 MB)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
      required: ['file'],
    },
  })
  @ApiResponse({ status: 201, description: 'Returns Cloudinary URL', schema: { example: { url: 'https://res.cloudinary.com/demo/resume.pdf' } } })
  @ApiResponse({ status: 400, description: 'Invalid file type or missing file' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        if (ALLOWED_MIMETYPES.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException('Only PDF and Word documents are allowed'),
            false,
          );
        }
      },
    }),
  )
  async upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file provided');
    const url = await this.uploadService.uploadResume(
      file.buffer,
      file.originalname,
    );
    return { url };
  }
}
