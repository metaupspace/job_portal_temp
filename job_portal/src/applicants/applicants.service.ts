import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { Applicant, ApplicantDocument } from './schemas/applicant.schema';
import { Application, ApplicationDocument } from '../applications/schemas/application.schema';
import { UpdateApplicantDto } from './dto/update-applicant.dto';
import { ApplicationStatus } from '../common/enums/application-status.enum';
import { MailService } from '../mail/mail.service';

const AES_ALGO = 'aes-256-cbc';

@Injectable()
export class ApplicantsService {
  private readonly logger = new Logger(ApplicantsService.name);
  private readonly encryptionKey: Buffer;

  constructor(
    @InjectModel(Applicant.name) private applicantModel: Model<ApplicantDocument>,
    @InjectModel(Application.name) private applicationModel: Model<ApplicationDocument>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {
    const keyHex = this.configService.getOrThrow<string>('totp.encryptionKey');
    this.encryptionKey = Buffer.from(keyHex, 'hex');
  }

  // ── Crypto helpers ──────────────────────────────────────────────────────────

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private encryptTotp(secret: string): string {
    const iv = randomBytes(16);
    const cipher = createCipheriv(AES_ALGO, this.encryptionKey, iv);
    const encrypted = Buffer.concat([cipher.update(secret, 'utf8'), cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  }

  private decryptTotp(encrypted: string): string {
    const [ivHex, dataHex] = encrypted.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = createDecipheriv(AES_ALGO, this.encryptionKey, iv);
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(dataHex, 'hex')),
      decipher.final(),
    ]);
    return decrypted.toString('utf8');
  }

  private generateBackupCodes(): { raw: string[]; formatted: string[] } {
    const raw = Array.from({ length: 8 }, () =>
      randomBytes(8).toString('hex').toUpperCase(),
    );
    const formatted = raw.map((c) => c.match(/.{4}/g)!.join('-'));
    return { raw, formatted };
  }

  private normalizeBackupCode(input: string): string {
    return input.replace(/-/g, '').toUpperCase();
  }

  private isBackupCode(input: string): boolean {
    return /^[A-F0-9]{16}$/.test(this.normalizeBackupCode(input));
  }

  // ── OTP (factor 1) ──────────────────────────────────────────────────────────

  async requestOtp(email: string): Promise<void> {
    const applicant = await this.applicantModel
      .findOne({ email: email.toLowerCase() })
      .exec();

    if (!applicant) return;

    const otp = this.generateOtp();
    applicant.otpHash = await bcrypt.hash(otp, 10);
    applicant.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await applicant.save();

    void this.mailService
      .sendOtp(applicant.email, otp)
      .catch((err) => this.logger.error('OTP email failed', err));
  }

  async verifyOtp(
    email: string,
    otp: string,
  ): Promise<
    | { requiresTotpSetup: true; setupToken: string }
    | { requiresTotp: true; sessionToken: string }
  > {
    const applicant = await this.applicantModel
      .findOne({ email: email.toLowerCase() })
      .exec();

    if (
      !applicant ||
      !applicant.otpHash ||
      !applicant.otpExpiresAt ||
      applicant.otpExpiresAt < new Date()
    ) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    const valid = await bcrypt.compare(otp, applicant.otpHash);
    if (!valid) throw new UnauthorizedException('Invalid or expired OTP');

    applicant.otpHash = null;
    applicant.otpExpiresAt = null;
    await applicant.save();

    const id = (applicant._id as { toString(): string }).toString();

    if (!applicant.mfaEnrolled) {
      const setupToken = this.jwtService.sign(
        { sub: id, email: applicant.email, role: 'applicant-setup' },
        { expiresIn: '15m' },
      );
      return { requiresTotpSetup: true, setupToken };
    }

    const sessionToken = this.jwtService.sign(
      { sub: id, email: applicant.email, role: 'applicant-session' },
      { expiresIn: '5m' },
    );
    return { requiresTotp: true, sessionToken };
  }

  // ── TOTP (factor 2) ─────────────────────────────────────────────────────────

  async setupTotp(applicantId: string): Promise<{
    qrCodeUri: string;
    qrCodeDataUrl: string;
    secret: string;
  }> {
    const applicant = await this.applicantModel.findById(applicantId).exec();
    if (!applicant) throw new NotFoundException('Applicant not found');

    const generated = speakeasy.generateSecret({
      name: `MetaUpSpace (${applicant.email})`,
      length: 20,
    });

    applicant.pendingTotpSecret = this.encryptTotp(generated.base32);
    await applicant.save();

    const qrCodeDataUrl = await QRCode.toDataURL(generated.otpauth_url!);

    return {
      qrCodeUri: generated.otpauth_url!,
      qrCodeDataUrl,
      secret: generated.base32,
    };
  }

  async confirmTotp(
    applicantId: string,
    code: string,
  ): Promise<{ accessToken: string; backupCodes: string[] }> {
    const applicant = await this.applicantModel.findById(applicantId).exec();
    if (!applicant) throw new NotFoundException('Applicant not found');
    if (!applicant.pendingTotpSecret) {
      throw new UnauthorizedException('No pending TOTP setup — call setup-totp first');
    }

    const totpSecretBase32 = this.decryptTotp(applicant.pendingTotpSecret);
    const valid = speakeasy.totp.verify({
      secret: totpSecretBase32,
      encoding: 'base32',
      token: code,
      window: 1,
    });
    if (!valid) throw new UnauthorizedException('Invalid TOTP code');

    const { raw, formatted } = this.generateBackupCodes();
    const hashedCodes = await Promise.all(raw.map((c) => bcrypt.hash(c, 10)));

    applicant.totpSecret = this.encryptTotp(totpSecretBase32);
    applicant.pendingTotpSecret = null;
    applicant.totpEnabled = true;
    applicant.mfaEnrolled = true;
    applicant.backupCodes = hashedCodes;
    await applicant.save();

    const accessToken = this.jwtService.sign({
      sub: (applicant._id as { toString(): string }).toString(),
      email: applicant.email,
      role: 'applicant',
    });

    return { accessToken, backupCodes: formatted };
  }

  async verifyTotp(
    applicantId: string,
    code: string,
  ): Promise<{ accessToken: string }> {
    const applicant = await this.applicantModel.findById(applicantId).exec();
    if (!applicant || !applicant.totpEnabled || !applicant.totpSecret) {
      throw new UnauthorizedException('TOTP not configured');
    }

    if (this.isBackupCode(code)) {
      const normalized = this.normalizeBackupCode(code);
      let matchIndex = -1;
      for (let i = 0; i < applicant.backupCodes.length; i++) {
        if (await bcrypt.compare(normalized, applicant.backupCodes[i])) {
          matchIndex = i;
          break;
        }
      }
      if (matchIndex === -1) throw new UnauthorizedException('Invalid backup code');
      applicant.backupCodes.splice(matchIndex, 1);
      await applicant.save();
    } else {
      const secret = this.decryptTotp(applicant.totpSecret);
      const valid = speakeasy.totp.verify({
        secret,
        encoding: 'base32',
        token: code,
        window: 1,
      });
      if (!valid) throw new UnauthorizedException('Invalid TOTP code');
    }

    const accessToken = this.jwtService.sign({
      sub: (applicant._id as { toString(): string }).toString(),
      email: applicant.email,
      role: 'applicant',
    });

    return { accessToken };
  }

  // ── Dashboard ────────────────────────────────────────────────────────────────

  async getProfile(applicantId: string): Promise<ApplicantDocument> {
    const applicant = await this.applicantModel
      .findById(applicantId)
      .select('-otpHash -totpSecret -pendingTotpSecret -backupCodes')
      .exec();
    if (!applicant) throw new NotFoundException('Applicant not found');
    return applicant;
  }

  async updateProfile(
    applicantId: string,
    dto: UpdateApplicantDto,
  ): Promise<ApplicantDocument> {
    const applicant = await this.applicantModel
      .findByIdAndUpdate(applicantId, dto, { new: true })
      .select('-otpHash -totpSecret -pendingTotpSecret -backupCodes')
      .exec();
    if (!applicant) throw new NotFoundException('Applicant not found');
    return applicant;
  }

  async getMyApplications(
    applicantId: string,
    email: string,
  ): Promise<
    {
      applicationId: string;
      jobTitle: string;
      jobSlug: string;
      status: ApplicationStatus;
      appliedAt: Date;
    }[]
  > {
    const applications = await this.applicationModel
      .find({
        $or: [
          { applicantId },
          { email: email.toLowerCase(), applicantId: null },
        ],
      })
      .populate<{ jobId: { title: string; slug: string } }>('jobId', 'title slug')
      .sort({ createdAt: -1 })
      .exec();

    return applications.map((a) => ({
      applicationId: (a._id as { toString(): string }).toString(),
      jobTitle: a.jobId ? (a.jobId as unknown as { title: string }).title : 'N/A',
      jobSlug: a.jobId ? (a.jobId as unknown as { slug: string }).slug : '',
      status: a.status,
      appliedAt: (a as unknown as { createdAt: Date }).createdAt,
    }));
  }

  async withdraw(applicationId: string, applicantId: string): Promise<void> {
    const applicant = await this.applicantModel.findById(applicantId).exec();
    if (!applicant) throw new NotFoundException('Applicant not found');

    const application = await this.applicationModel.findById(applicationId).exec();
    if (!application) throw new NotFoundException('Application not found');

    const isOwner =
      (application.applicantId &&
        application.applicantId.toString() === applicantId) ||
      (!application.applicantId && application.email === applicant.email);

    if (!isOwner) throw new ForbiddenException('Not your application');

    const withdrawable: ApplicationStatus[] = [
      ApplicationStatus.PENDING,
      ApplicationStatus.REVIEWED,
    ];
    if (!withdrawable.includes(application.status)) {
      throw new ConflictException(
        `Cannot withdraw application with status: ${application.status}`,
      );
    }

    application.status = ApplicationStatus.WITHDRAWN;
    await application.save();
  }
}
