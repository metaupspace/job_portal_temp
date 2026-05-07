import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private readonly uploadsDir = path.join(process.cwd(), 'uploads', 'resumes');

  constructor(private readonly configService: ConfigService) {}

  async uploadResume(buffer: Buffer, originalName: string): Promise<string> {
    await fs.mkdir(this.uploadsDir, { recursive: true });

    const sanitizedName = originalName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filename = `${Date.now()}-${sanitizedName}`;
    const filepath = path.join(this.uploadsDir, filename);

    await fs.writeFile(filepath, buffer);
    this.logger.log(`Resume saved: ${filepath}`);

    const port = this.configService.get<number>('port') ?? 3000;
    const base =
      this.configService.get<string>('publicUrl') ?? `http://localhost:${port}`;
    return `${base}/uploads/resumes/${filename}`;
  }
}
