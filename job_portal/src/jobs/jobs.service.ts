import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Job, JobDocument } from './schemas/job.schema';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { QueryJobsDto } from './dto/query-jobs.dto';

@Injectable()
export class JobsService {
  constructor(@InjectModel(Job.name) private jobModel: Model<JobDocument>) {}

  private generateSlug(title: string): string {
    const base = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    return `${base}-${Date.now().toString(36)}`;
  }

  async create(createJobDto: CreateJobDto): Promise<JobDocument> {
    const slug = this.generateSlug(createJobDto.title);
    try {
      return await this.jobModel.create({ ...createJobDto, slug });
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code: number }).code === 11000
      ) {
        throw new ConflictException(
          'A job with a similar title already exists',
        );
      }
      throw error;
    }
  }

  async findAllActive(): Promise<JobDocument[]> {
    return this.jobModel.find({ isActive: true }).exec();
  }

  async findAllAdmin(query: QueryJobsDto): Promise<{
    data: JobDocument[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const filter: Record<string, unknown> = {};

    if (query.search) {
      filter.$or = [
        { title: { $regex: query.search, $options: 'i' } },
        { domain: { $regex: query.search, $options: 'i' } },
      ];
    }
    if (query.type) filter.type = query.type;
    if (query.isActive !== undefined) filter.isActive = query.isActive;

    const [data, total] = await Promise.all([
      this.jobModel
        .find(filter)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.jobModel.countDocuments(filter).exec(),
    ]);

    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<JobDocument> {
    const job = await this.jobModel.findById(id).exec();
    if (!job) throw new NotFoundException(`Job ${id} not found`);
    return job;
  }

  async findOneActive(id: string): Promise<JobDocument> {
    const job = await this.jobModel.findById(id).exec();
    if (!job || !job.isActive)
      throw new NotFoundException(`Job ${id} not found`);
    return job;
  }

  async findBySlug(slug: string): Promise<JobDocument> {
    const job = await this.jobModel.findOne({ slug, isActive: true }).exec();
    if (!job) throw new NotFoundException(`Job not found`);
    return job;
  }

  async findBySlugAdmin(slug: string): Promise<JobDocument> {
    const job = await this.jobModel.findOne({ slug }).exec();
    if (!job) throw new NotFoundException(`Job not found`);
    return job;
  }

  async update(id: string, updateJobDto: UpdateJobDto): Promise<JobDocument> {
    const job = await this.jobModel
      .findByIdAndUpdate(id, updateJobDto, { new: true, runValidators: true })
      .exec();
    if (!job) throw new NotFoundException(`Job ${id} not found`);
    return job;
  }

  async softDelete(id: string): Promise<JobDocument> {
    return this.update(id, { isActive: false });
  }
}
