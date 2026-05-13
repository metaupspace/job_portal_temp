// src/applications/applications.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Application, ApplicationDocument } from './schemas/application.schema';
import { Applicant, ApplicantDocument } from '../applicants/schemas/applicant.schema';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { QueryApplicationsDto } from './dto/query-applications.dto';
import { JobsService } from '../jobs/jobs.service';
import { MailService } from '../mail/mail.service';
import { JobType } from '../common/enums/job-type.enum';
import { ApplicationStatus } from '../common/enums/application-status.enum';

@Injectable()
export class ApplicationsService {
  private readonly logger = new Logger(ApplicationsService.name);

  constructor(
    @InjectModel(Application.name)
    private applicationModel: Model<ApplicationDocument>,
    @InjectModel(Applicant.name)
    private applicantModel: Model<ApplicantDocument>,
    private readonly jobsService: JobsService,
    private readonly mailService: MailService,
  ) {}

  async create(
    jobIdentifier: string,
    dto: CreateApplicationDto,
  ): Promise<ApplicationDocument> {
    const job = isValidObjectId(jobIdentifier)
      ? await this.jobsService.findOne(jobIdentifier)
      : await this.jobsService.findBySlug(jobIdentifier);

    if (!job.isActive) {
      throw new BadRequestException(
        'This job is no longer accepting applications',
      );
    }

    if (job.type === JobType.TECH) {
      const techFields = [
        'githubId',
        'portfolioLink',
        'technologiesKnown',
        'hardestProblem',
      ] as const;
      const missing = techFields.filter((f) => !dto[f]);
      if (missing.length) {
        throw new BadRequestException(
          `Missing required tech fields: ${missing.join(', ')}`,
        );
      }
    }

    const duplicate = await this.applicationModel
      .findOne({ jobId: job._id, email: dto.email })
      .lean()
      .exec();
    if (duplicate) {
      throw new ConflictException('You have already applied for this job');
    }

    const missingCustom = job.customFields
      .filter(
        (f) =>
          f.required &&
          (!dto.customResponses || dto.customResponses[f.fieldId] == null),
      )
      .map((f) => f.label);

    if (missingCustom.length) {
      throw new BadRequestException(
        `Missing required fields: ${missingCustom.join(', ')}`,
      );
    }

    const applicant = await this.applicantModel
      .findOneAndUpdate(
        { email: dto.email.toLowerCase() },
        {
          $setOnInsert: {
            email: dto.email.toLowerCase(),
            fullName: dto.fullName,
            contactNumber: dto.contactNumber,
            whatsappNumber: dto.whatsappNumber,
            currentLocation: dto.currentLocation,
            linkedinId: dto.linkedinId,
            qualification: dto.qualification,
            experience: dto.experience,
            mfaEnrolled: false,
            totpEnabled: false,
            backupCodes: [],
            otpHash: null,
            otpExpiresAt: null,
            totpSecret: null,
            pendingTotpSecret: null,
          },
          $set: { resumeUrl: dto.resumeUrl },
        },
        { upsert: true, new: true },
      )
      .exec();

    const application = await this.applicationModel.create({
      ...dto,
      jobId: job._id,
      applicantId: applicant!._id,
      status: ApplicationStatus.PENDING,
    });

    void this.mailService
      .sendApplicationConfirmationToCandidate(
        dto.email,
        dto.fullName,
        job.title,
      )
      .catch((err) =>
        this.logger.error('Candidate confirmation email failed', err),
      );

    void this.mailService
      .sendNewApplicationAlertToAdmin(dto.fullName, dto.email, job.title)
      .catch((err) => this.logger.error('Admin alert email failed', err));

    void this.mailService
      .sendDashboardNudge(dto.email, dto.fullName, job.title)
      .catch((err) => this.logger.error('Dashboard nudge email failed', err));

    return application;
  }

  async findAll(query: QueryApplicationsDto): Promise<{
    data: ApplicationDocument[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const filter: Record<string, unknown> = {};
    if (query.jobSlug) {
      const job = await this.jobsService.findBySlugAdmin(query.jobSlug);
      filter.jobId = job._id;
    }
    if (query.status) filter.status = query.status;
    if (query.search) {
      const regex = { $regex: query.search, $options: 'i' };
      filter.$or = [
        { fullName: regex },
        { email: regex },
        { contactNumber: regex },
      ];
    }

    const [data, total] = await Promise.all([
      this.applicationModel
        .find(filter)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate('jobId', 'title type')
        .exec(),
      this.applicationModel.countDocuments(filter).exec(),
    ]);

    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<ApplicationDocument> {
    const application = await this.applicationModel
      .findById(id)
      .populate('jobId', 'title type customFields')
      .exec();
    if (!application)
      throw new NotFoundException(`Application ${id} not found`);
    return application;
  }

  async updateStatus(
    id: string,
    dto: UpdateStatusDto,
  ): Promise<ApplicationDocument> {
    const application = await this.applicationModel
      .findByIdAndUpdate(id, { status: dto.status }, { new: true })
      .populate('jobId', 'title')
      .exec();
    if (!application)
      throw new NotFoundException(`Application ${id} not found`);

    if (dto.status !== ApplicationStatus.PENDING) {
      const jobTitle =
        (application.jobId as unknown as { title: string })?.title ??
        'the position';
      void this.mailService
        .sendStatusUpdate(
          application.email,
          application.fullName,
          jobTitle,
          dto.status,
        )
        .catch((err) => this.logger.error('Status update email failed', err));
    }

    return application;
  }

  async checkStatus(
    id: string,
    email: string,
  ): Promise<{
    applicationId: string;
    status: ApplicationStatus;
    jobTitle: string;
    appliedAt: Date;
  }> {
    const application = await this.applicationModel
      .findById(id)
      .populate('jobId', 'title')
      .exec();

    if (!application || application.email.toLowerCase() !== email.toLowerCase()) {
      throw new NotFoundException('Application not found');
    }

    return {
      applicationId: (application._id as { toString(): string }).toString(),
      status: application.status,
      jobTitle:
        (application.jobId as unknown as { title: string })?.title ?? 'N/A',
      appliedAt: (application as unknown as { createdAt: Date }).createdAt,
    };
  }

  async findByEmail(email: string): Promise<
    {
      applicationId: string;
      status: ApplicationStatus;
      jobTitle: string;
      appliedAt: Date;
    }[]
  > {
    const applications = await this.applicationModel
      .find({ email: email.toLowerCase() })
      .populate('jobId', 'title')
      .sort({ createdAt: -1 })
      .exec();

    return applications.map((a) => ({
      applicationId: (a._id as { toString(): string }).toString(),
      status: a.status,
      jobTitle: (a.jobId as unknown as { title: string })?.title ?? 'N/A',
      appliedAt: (a as unknown as { createdAt: Date }).createdAt,
    }));
  }

  async remove(id: string): Promise<void> {
    const result = await this.applicationModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Application ${id} not found`);
  }
}
