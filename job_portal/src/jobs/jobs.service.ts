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

  async findAllAdmin(): Promise<JobDocument[]> {
    return this.jobModel.find().exec();
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
