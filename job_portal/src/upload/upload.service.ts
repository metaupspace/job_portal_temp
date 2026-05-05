import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: configService.get<string>('cloudinary.cloudName'),
      api_key: configService.get<string>('cloudinary.apiKey'),
      api_secret: configService.get<string>('cloudinary.apiSecret'),
    });
  }

  async uploadResume(buffer: Buffer, originalName: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const sanitizedName = originalName.replace(/[^a-zA-Z0-9._-]/g, '_');
      const ext = sanitizedName.includes('.')
        ? sanitizedName.slice(sanitizedName.lastIndexOf('.'))
        : '';
      const nameWithoutExt = ext
        ? sanitizedName.slice(0, sanitizedName.length - ext.length)
        : sanitizedName;
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw',
          folder: 'metaupspace/resumes',
          public_id: `${Date.now()}-${nameWithoutExt}`,
        },
        (error, result) => {
          if (error || !result) {
            this.logger.error('Cloudinary upload failed', error);
            reject(new InternalServerErrorException('Resume upload failed'));
          } else {
            resolve(result.secure_url);
          }
        },
      );
      uploadStream.end(buffer);
    });
  }
}
