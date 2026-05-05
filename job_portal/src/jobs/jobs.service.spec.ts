import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { Job } from './schemas/job.schema';
import { JobType } from '../common/enums/job-type.enum';

const mockJob = {
  _id: 'job-id-1',
  title: 'Backend Developer',
  slug: 'backend-developer-abc',
  description: 'Build APIs',
  domain: 'Backend',
  type: JobType.TECH,
  isActive: true,
  requirements: [],
  customFields: [],
};

describe('JobsService', () => {
  let service: JobsService;
  let mockJobModel: {
    create: jest.Mock;
    find: jest.Mock;
    findById: jest.Mock;
    findByIdAndUpdate: jest.Mock;
  };

  beforeEach(async () => {
    mockJobModel = {
      create: jest.fn(),
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobsService,
        { provide: getModelToken(Job.name), useValue: mockJobModel },
      ],
    }).compile();

    service = module.get<JobsService>(JobsService);
  });

  describe('create', () => {
    it('creates job and generates slug from title', async () => {
      mockJobModel.create.mockResolvedValue(mockJob);
      const dto = {
        title: 'Backend Developer',
        description: 'Build APIs',
        domain: 'Backend',
        type: JobType.TECH,
      };
      const result = await service.create(dto);
      expect(mockJobModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Backend Developer',
          slug: expect.stringMatching(/^backend-developer-/) as unknown,
        }),
      );
      expect(result).toEqual(mockJob);
    });

    it('throws ConflictException on E11000 duplicate slug', async () => {
      mockJobModel.create.mockRejectedValue({ code: 11000 });
      const dto = {
        title: 'Backend Developer',
        description: 'Build APIs',
        domain: 'Backend',
        type: JobType.TECH,
      };
      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAllActive', () => {
    it('queries only isActive: true', async () => {
      mockJobModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockJob]),
      });
      const result = await service.findAllActive();
      expect(mockJobModel.find).toHaveBeenCalledWith({ isActive: true });
      expect(result).toEqual([mockJob]);
    });
  });

  describe('findAllAdmin', () => {
    it('queries all jobs without filter', async () => {
      mockJobModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockJob]),
      });
      await service.findAllAdmin();
      expect(mockJobModel.find).toHaveBeenCalledWith();
    });
  });

  describe('findOne', () => {
    it('returns job when found', async () => {
      mockJobModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockJob),
      });
      const result = await service.findOne('job-id-1');
      expect(result).toEqual(mockJob);
    });

    it('throws NotFoundException when job does not exist', async () => {
      mockJobModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
      await expect(service.findOne('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('returns updated job', async () => {
      const updated = { ...mockJob, domain: 'DevOps' };
      mockJobModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updated),
      });
      const result = await service.update('job-id-1', { domain: 'DevOps' });
      expect(mockJobModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'job-id-1',
        { domain: 'DevOps' },
        { new: true, runValidators: true },
      );
      expect((result as unknown as { domain: string }).domain).toBe('DevOps');
    });

    it('throws NotFoundException when job does not exist', async () => {
      mockJobModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
      await expect(service.update('nonexistent-id', {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('softDelete', () => {
    it('sets isActive to false', async () => {
      const deleted = { ...mockJob, isActive: false };
      mockJobModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(deleted),
      });
      const result = await service.softDelete('job-id-1');
      expect(mockJobModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'job-id-1',
        { isActive: false },
        { new: true, runValidators: true },
      );
      expect(result.isActive).toBe(false);
    });

    it('throws NotFoundException when job does not exist', async () => {
      mockJobModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
      await expect(service.softDelete('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
