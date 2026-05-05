// src/applications/applications.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { Application } from './schemas/application.schema';
import { Applicant } from '../applicants/schemas/applicant.schema';
import { JobsService } from '../jobs/jobs.service';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { JobType } from '../common/enums/job-type.enum';
import { ApplicationStatus } from '../common/enums/application-status.enum';
import { Experience } from '../common/enums/experience.enum';
import { HearAboutUs } from '../common/enums/hear-about-us.enum';

describe('ApplicationStatus', () => {
  it('includes WITHDRAWN', () => {
    expect(ApplicationStatus.WITHDRAWN).toBe('withdrawn');
  });
});

const mockTechJob = {
  _id: 'job-id-1',
  title: 'Backend Developer',
  type: JobType.TECH,
  isActive: true,
  customFields: [],
};

const mockNonTechJob = {
  _id: 'job-id-2',
  title: 'Sales Executive',
  type: JobType.NON_TECH,
  isActive: true,
  customFields: [
    {
      fieldId: 'region',
      label: 'Preferred Region',
      fieldType: 'text',
      required: true,
      options: [],
    },
  ],
};

const baseDto = {
  fullName: 'John Doe',
  email: 'john@example.com',
  contactNumber: '9999999999',
  whatsappNumber: '9999999999',
  currentLocation: 'Mumbai',
  linkedinId: 'linkedin.com/in/johndoe',
  qualification: 'B.Tech',
  experience: Experience.FRESHER,
  comfortableFlexibleShifts: true,
  lastSalary: '0',
  noticePeriod: 'Immediate',
  hearAboutUs: HearAboutUs.LINKEDIN_POST,
  resumeUrl: 'https://cloudinary.com/resume.pdf',
  whyGoodFit: 'I am passionate about backend dev.',
  whyJoinUs: 'Great company.',
};

const techDto = {
  ...baseDto,
  githubId: 'github.com/johndoe',
  portfolioLink: 'https://johndoe.dev',
  technologiesKnown: 'Node.js, MongoDB',
  hardestProblem: 'Optimized a slow DB query.',
};

const mockApplication = {
  _id: 'app-id-1',
  ...techDto,
  jobId: 'job-id-1',
  status: ApplicationStatus.PENDING,
};

describe('ApplicationsService', () => {
  let service: ApplicationsService;
  let mockApplicationModel: {
    create: jest.Mock;
    find: jest.Mock;
    findOne: jest.Mock;
    findById: jest.Mock;
    findByIdAndUpdate: jest.Mock;
    findByIdAndDelete: jest.Mock;
    countDocuments: jest.Mock;
  };
  let mockJobsService: { findOne: jest.Mock; findBySlug: jest.Mock };
  let mockMailService: {
    sendApplicationConfirmationToCandidate: jest.Mock;
    sendNewApplicationAlertToAdmin: jest.Mock;
    sendStatusUpdate: jest.Mock;
    sendDashboardNudge: jest.Mock;
  };

  beforeEach(async () => {
    mockApplicationModel = {
      create: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn().mockReturnValue({ lean: () => ({ exec: () => Promise.resolve(null) }) }),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
      countDocuments: jest.fn(),
    };

    mockJobsService = { findOne: jest.fn(), findBySlug: jest.fn() };

    mockMailService = {
      sendApplicationConfirmationToCandidate: jest
        .fn()
        .mockResolvedValue(undefined),
      sendNewApplicationAlertToAdmin: jest.fn().mockResolvedValue(undefined),
      sendStatusUpdate: jest.fn().mockResolvedValue(undefined),
      sendDashboardNudge: jest.fn().mockResolvedValue(undefined),
    };

    const mockApplicantModel = {
      findOneAndUpdate: jest.fn().mockReturnValue({
        exec: () => Promise.resolve({ _id: 'applicant-id-1' }),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationsService,
        {
          provide: getModelToken(Application.name),
          useValue: mockApplicationModel,
        },
        {
          provide: getModelToken(Applicant.name),
          useValue: mockApplicantModel,
        },
        { provide: JobsService, useValue: mockJobsService },
        { provide: MailService, useValue: mockMailService },
        { provide: ConfigService, useValue: { get: jest.fn() } },
      ],
    }).compile();

    service = module.get<ApplicationsService>(ApplicationsService);
  });

  describe('create', () => {
    const noDuplicate = () => ({
      lean: () => ({ exec: () => Promise.resolve(null) }),
    });

    it('creates application for active tech job with all tech fields', async () => {
      mockJobsService.findBySlug.mockResolvedValue(mockTechJob);
      mockApplicationModel.findOne = jest.fn().mockReturnValue(noDuplicate());
      mockApplicationModel.create.mockResolvedValue(mockApplication);
      const result = await service.create('job-id-1', techDto);
      expect(mockApplicationModel.create).toHaveBeenCalledWith(
        expect.objectContaining({ status: ApplicationStatus.PENDING }),
      );
      expect(result).toEqual(mockApplication);
      await new Promise((resolve) => setImmediate(resolve));
      expect(
        mockMailService.sendApplicationConfirmationToCandidate,
      ).toHaveBeenCalledWith(techDto.email, techDto.fullName, mockTechJob.title);
      expect(mockMailService.sendNewApplicationAlertToAdmin).toHaveBeenCalledWith(
        techDto.fullName,
        techDto.email,
        mockTechJob.title,
      );
    });

    it('throws BadRequestException when job is inactive', async () => {
      mockJobsService.findBySlug.mockResolvedValue({ ...mockTechJob, isActive: false });
      await expect(service.create('job-id-1', techDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('throws BadRequestException when tech fields missing for tech job', async () => {
      mockJobsService.findBySlug.mockResolvedValue(mockTechJob);
      mockApplicationModel.findOne = jest.fn().mockReturnValue(noDuplicate());
      await expect(service.create('job-id-1', baseDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('throws BadRequestException when required custom field missing', async () => {
      mockJobsService.findBySlug.mockResolvedValue(mockNonTechJob);
      mockApplicationModel.findOne = jest.fn().mockReturnValue(noDuplicate());
      await expect(service.create('job-id-2', baseDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('creates non-tech application with required custom field provided', async () => {
      mockJobsService.findBySlug.mockResolvedValue(mockNonTechJob);
      mockApplicationModel.findOne = jest.fn().mockReturnValue({
        lean: () => ({ exec: () => Promise.resolve(null) }),
      });
      mockApplicationModel.create.mockResolvedValue(mockApplication);
      const dto = { ...baseDto, customResponses: { region: 'West India' } };
      await service.create('job-id-2', dto);
      expect(mockApplicationModel.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('returns paginated results with total', async () => {
      mockApplicationModel.find.mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            sort: jest.fn().mockReturnValue({
              populate: jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValue([mockApplication]),
              }),
            }),
          }),
        }),
      });
      mockApplicationModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(1),
      });
      const result = await service.findAll({ page: 1, limit: 10 });
      expect(result.total).toBe(1);
      expect(result.data).toEqual([mockApplication]);
    });
  });

  describe('findOne', () => {
    it('returns application when found', async () => {
      mockApplicationModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockApplication),
        }),
      });
      const result = await service.findOne('app-id-1');
      expect(result).toEqual(mockApplication);
    });

    it('throws NotFoundException when application does not exist', async () => {
      mockApplicationModel.findById.mockReturnValue({
        populate: jest
          .fn()
          .mockReturnValue({ exec: jest.fn().mockResolvedValue(null) }),
      });
      await expect(service.findOne('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateStatus', () => {
    it('updates status and returns updated application', async () => {
      const updated = {
        ...mockApplication,
        status: ApplicationStatus.SHORTLISTED,
        jobId: { title: 'Backend Developer' },
      };
      mockApplicationModel.findByIdAndUpdate.mockReturnValue({
        populate: jest
          .fn()
          .mockReturnValue({ exec: jest.fn().mockResolvedValue(updated) }),
      });
      const result = await service.updateStatus('app-id-1', {
        status: ApplicationStatus.SHORTLISTED,
      });
      expect(result.status).toBe(ApplicationStatus.SHORTLISTED);
      await new Promise((resolve) => setImmediate(resolve));
      expect(mockMailService.sendStatusUpdate).toHaveBeenCalledWith(
        updated.email,
        updated.fullName,
        'Backend Developer',
        ApplicationStatus.SHORTLISTED,
      );
    });

    it('throws NotFoundException when application does not exist', async () => {
      mockApplicationModel.findByIdAndUpdate.mockReturnValue({
        populate: jest
          .fn()
          .mockReturnValue({ exec: jest.fn().mockResolvedValue(null) }),
      });
      await expect(
        service.updateStatus('nonexistent', {
          status: ApplicationStatus.REVIEWED,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('deletes application', async () => {
      mockApplicationModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockApplication),
      });
      await expect(service.remove('app-id-1')).resolves.toBeUndefined();
    });

    it('throws NotFoundException when application does not exist', async () => {
      mockApplicationModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
      await expect(service.remove('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
