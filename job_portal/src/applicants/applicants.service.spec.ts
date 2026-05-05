import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  UnauthorizedException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { ApplicantsService } from './applicants.service';
import { Applicant } from './schemas/applicant.schema';
import { Application } from '../applications/schemas/application.schema';
import { MailService } from '../mail/mail.service';
import { ApplicationStatus } from '../common/enums/application-status.enum';

const makeApplicantModel = () => ({
  findOne: jest.fn(),
  findById: jest.fn(),
  findOneAndUpdate: jest.fn(),
  find: jest.fn(),
});

const makeApplicationModel = () => ({
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
});

const makeJwtService = () => ({
  sign: jest.fn().mockReturnValue('mock-token'),
});

const makeMailService = () => ({
  sendOtp: jest.fn().mockResolvedValue(undefined),
});

const makeConfigService = () => ({
  getOrThrow: jest.fn((key: string) => {
    if (key === 'totp.encryptionKey') return 'a'.repeat(64);
    return 'mock-value';
  }),
});

describe('ApplicantsService', () => {
  let module: TestingModule;
  let service: ApplicantsService;
  let applicantModel: ReturnType<typeof makeApplicantModel>;
  let applicationModel: ReturnType<typeof makeApplicationModel>;
  let mailService: ReturnType<typeof makeMailService>;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        ApplicantsService,
        { provide: getModelToken(Applicant.name), useFactory: makeApplicantModel },
        { provide: getModelToken(Application.name), useFactory: makeApplicationModel },
        { provide: JwtService, useFactory: makeJwtService },
        { provide: MailService, useFactory: makeMailService },
        { provide: ConfigService, useFactory: makeConfigService },
      ],
    }).compile();

    service = module.get<ApplicantsService>(ApplicantsService);
    applicantModel = module.get(getModelToken(Applicant.name));
    applicationModel = module.get(getModelToken(Application.name));
    mailService = module.get(MailService);
  });

  describe('requestOtp', () => {
    it('returns silently when applicant does not exist', async () => {
      applicantModel.findOne.mockReturnValue({ exec: () => Promise.resolve(null) });
      await expect(service.requestOtp('unknown@example.com')).resolves.toBeUndefined();
      expect(mailService.sendOtp).not.toHaveBeenCalled();
    });

    it('stores hashed OTP and sends email when applicant exists', async () => {
      const mockApplicant = {
        _id: 'id1',
        email: 'jane@example.com',
        save: jest.fn().mockResolvedValue(undefined),
        otpHash: null as string | null,
        otpExpiresAt: null as Date | null,
      };
      applicantModel.findOne.mockReturnValue({ exec: () => Promise.resolve(mockApplicant) });

      await service.requestOtp('jane@example.com');

      expect(mockApplicant.save).toHaveBeenCalled();
      expect(mockApplicant.otpHash).not.toBeNull();
      expect(mockApplicant.otpExpiresAt).toBeInstanceOf(Date);
      expect(mailService.sendOtp).toHaveBeenCalledWith(
        'jane@example.com',
        expect.stringMatching(/^\d{6}$/),
      );
    });
  });

  describe('verifyOtp', () => {
    it('throws UnauthorizedException when no applicant found', async () => {
      applicantModel.findOne.mockReturnValue({ exec: () => Promise.resolve(null) });
      await expect(service.verifyOtp('x@x.com', '123456')).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when OTP expired', async () => {
      applicantModel.findOne.mockReturnValue({
        exec: () =>
          Promise.resolve({
            email: 'jane@example.com',
            otpHash: 'hash',
            otpExpiresAt: new Date(Date.now() - 1000),
            mfaEnrolled: false,
          }),
      });
      await expect(service.verifyOtp('jane@example.com', '123456')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('returns requiresTotpSetup when valid OTP and mfaEnrolled=false', async () => {
      const bcrypt = await import('bcrypt');
      const otp = '482910';
      const hash = await bcrypt.hash(otp, 10);
      const mockApplicant = {
        _id: 'id1',
        email: 'jane@example.com',
        otpHash: hash,
        otpExpiresAt: new Date(Date.now() + 600_000),
        mfaEnrolled: false,
        save: jest.fn().mockResolvedValue(undefined),
      };
      applicantModel.findOne.mockReturnValue({ exec: () => Promise.resolve(mockApplicant) });

      const result = await service.verifyOtp('jane@example.com', otp);

      expect(result).toEqual({ requiresTotpSetup: true, setupToken: 'mock-token' });
      expect(mockApplicant.otpHash).toBeNull();
    });

    it('returns requiresTotp when valid OTP and mfaEnrolled=true', async () => {
      const bcrypt = await import('bcrypt');
      const otp = '482910';
      const hash = await bcrypt.hash(otp, 10);
      const mockApplicant = {
        _id: 'id1',
        email: 'jane@example.com',
        otpHash: hash,
        otpExpiresAt: new Date(Date.now() + 600_000),
        mfaEnrolled: true,
        save: jest.fn().mockResolvedValue(undefined),
      };
      applicantModel.findOne.mockReturnValue({ exec: () => Promise.resolve(mockApplicant) });

      const result = await service.verifyOtp('jane@example.com', otp);

      expect(result).toEqual({ requiresTotp: true, sessionToken: 'mock-token' });
    });
  });

  describe('withdraw', () => {
    it('throws ForbiddenException when applicantId does not match', async () => {
      applicantModel.findById.mockReturnValue({
        exec: () => Promise.resolve({ _id: { toString: () => 'my-id' }, email: 'jane@example.com' }),
      });
      applicationModel.findById.mockReturnValue({
        exec: () =>
          Promise.resolve({
            applicantId: { toString: () => 'other-id' },
            email: 'other@example.com',
            status: ApplicationStatus.PENDING,
          }),
      });

      await expect(service.withdraw('app-id', 'my-id')).rejects.toThrow(ForbiddenException);
    });

    it('throws ConflictException when status is SHORTLISTED', async () => {
      applicantModel.findById.mockReturnValue({
        exec: () => Promise.resolve({ _id: { toString: () => 'my-id' }, email: 'jane@example.com' }),
      });
      applicationModel.findById.mockReturnValue({
        exec: () =>
          Promise.resolve({
            applicantId: { toString: () => 'my-id' },
            email: 'jane@example.com',
            status: ApplicationStatus.SHORTLISTED,
          }),
      });

      await expect(service.withdraw('app-id', 'my-id')).rejects.toThrow(ConflictException);
    });

    it('sets status WITHDRAWN for pending application owned by applicant', async () => {
      const mockApp = {
        applicantId: { toString: () => 'my-id' },
        email: 'jane@example.com',
        status: ApplicationStatus.PENDING,
        save: jest.fn().mockResolvedValue(undefined),
      };
      applicantModel.findById.mockReturnValue({
        exec: () => Promise.resolve({ _id: { toString: () => 'my-id' }, email: 'jane@example.com' }),
      });
      applicationModel.findById.mockReturnValue({ exec: () => Promise.resolve(mockApp) });

      await service.withdraw('app-id', 'my-id');

      expect(mockApp.status).toBe(ApplicationStatus.WITHDRAWN);
      expect(mockApp.save).toHaveBeenCalled();
    });
  });
});
