# Applicant Identity & Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add persistent applicant identity with Email OTP + TOTP MFA auth, a protected dashboard (view/update profile, list applications, withdraw), and auto-profile creation on every application submit.

**Architecture:** New `Applicants` Mongoose collection + `ApplicantsModule`. Authentication uses a second Passport JWT strategy (`jwt-applicant`) with three scoped roles (`applicant-setup`, `applicant-session`, `applicant`) to gate the multi-step MFA enrollment flow. `ApplicationsService.create()` upserts an `Applicant` profile on every submission and links `applicantId` to the new application.

**Tech Stack:** NestJS 11, Mongoose, `speakeasy` (TOTP), `qrcode` (QR URI→data URL), `bcrypt` (OTP + backup code hashing), Node.js `crypto` (AES-256-CBC for TOTP secret at rest), `@nestjs/jwt` (multi-role short-lived tokens).

---

## File Map

**Create:**
- `src/applicants/schemas/applicant.schema.ts` — Mongoose schema + document type
- `src/applicants/dto/request-otp.dto.ts` — `{ email }`
- `src/applicants/dto/verify-otp.dto.ts` — `{ email, otp }`
- `src/applicants/dto/verify-totp.dto.ts` — `{ code }`
- `src/applicants/dto/update-applicant.dto.ts` — all optional profile fields
- `src/applicants/applicants.service.ts` — all business logic
- `src/applicants/applicants.controller.ts` — HTTP routes
- `src/applicants/applicants.module.ts` — module wiring
- `src/applicants/applicants.service.spec.ts` — unit tests
- `src/auth/strategies/applicant-jwt.strategy.ts` — `passport-jwt` strategy, name `jwt-applicant`
- `src/common/guards/applicant.guard.ts` — checks `role === 'applicant'`
- `src/common/guards/applicant-setup.guard.ts` — checks `role === 'applicant-setup'`
- `src/common/guards/applicant-session.guard.ts` — checks `role === 'applicant-session'`
- `src/common/decorators/applicant-only.decorator.ts`
- `src/common/decorators/setup-token-only.decorator.ts`
- `src/common/decorators/session-token-only.decorator.ts`
- `src/common/decorators/current-applicant.decorator.ts`

**Modify:**
- `src/common/enums/application-status.enum.ts` — add `WITHDRAWN`
- `src/applications/schemas/application.schema.ts` — add optional `applicantId` field
- `src/applications/applications.service.ts` — upsert applicant in `create()`, inject `ApplicantModel`
- `src/applications/applications.module.ts` — add `MongooseModule.forFeature` for `Applicant`
- `src/auth/auth.module.ts` — register `ApplicantJwtStrategy`
- `src/config/configuration.ts` — add `totp.encryptionKey`
- `src/app.module.ts` — import `ApplicantsModule`
- `src/mail/mail.service.ts` — add `sendOtp()` + `sendDashboardNudge()`

---

## Task 1: Install Dependencies & Add Env Config

**Files:**
- Modify: `package.json` (via npm install)
- Modify: `src/config/configuration.ts`
- Modify: `.env` (add new key)

- [ ] **Step 1: Install runtime packages**

```bash
npm install speakeasy qrcode
```

Expected: `added N packages` with no errors.

- [ ] **Step 2: Install type packages**

```bash
npm install --save-dev @types/speakeasy @types/qrcode
```

Expected: `added N packages` with no errors.

- [ ] **Step 3: Add TOTP config to `src/config/configuration.ts`**

```typescript
export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10) || 3000,
  mongodb: {
    uri: process.env.MONGODB_URI,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  totp: {
    encryptionKey: process.env.TOTP_ENCRYPTION_KEY,
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  mail: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  admin: {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  },
  cors: {
    origin: process.env.CORS_ORIGIN,
  },
});
```

- [ ] **Step 4: Add `TOTP_ENCRYPTION_KEY` to `.env`**

Generate a 32-byte hex key by running in Node:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Then add the output to `.env`:

```
TOTP_ENCRYPTION_KEY=<paste-64-hex-chars-here>
```

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json src/config/configuration.ts
git commit -m "feat: install speakeasy/qrcode, add TOTP_ENCRYPTION_KEY config"
```

---

## Task 2: Extend ApplicationStatus Enum + Application Schema

**Files:**
- Modify: `src/common/enums/application-status.enum.ts`
- Modify: `src/applications/schemas/application.schema.ts`

- [ ] **Step 1: Write failing test for WITHDRAWN status**

In `src/applications/applications.service.spec.ts` (create file if it doesn't exist):

```typescript
import { ApplicationStatus } from '../common/enums/application-status.enum';

describe('ApplicationStatus', () => {
  it('includes WITHDRAWN', () => {
    expect(ApplicationStatus.WITHDRAWN).toBe('withdrawn');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx jest src/applications/applications.service.spec.ts --passWithNoTests
```

Expected: FAIL — `ApplicationStatus.WITHDRAWN is undefined`

- [ ] **Step 3: Add WITHDRAWN to the enum**

```typescript
// src/common/enums/application-status.enum.ts
export enum ApplicationStatus {
  PENDING = 'pending',
  REVIEWED = 'reviewed',
  SHORTLISTED = 'shortlisted',
  REJECTED = 'rejected',
  HIRED = 'hired',
  WITHDRAWN = 'withdrawn',
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx jest src/applications/applications.service.spec.ts
```

Expected: PASS

- [ ] **Step 5: Add `applicantId` to Application schema**

```typescript
// src/applications/schemas/application.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Experience } from '../../common/enums/experience.enum';
import { HearAboutUs } from '../../common/enums/hear-about-us.enum';
import { ApplicationStatus } from '../../common/enums/application-status.enum';

export type ApplicationDocument = Application & Document;

@Schema({ timestamps: true })
export class Application {
  @Prop({ type: Types.ObjectId, ref: 'Job', required: false })
  jobId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Applicant', required: false, default: null })
  applicantId!: Types.ObjectId | null;

  @Prop({ required: true }) fullName!: string;
  @Prop({ required: true }) email!: string;
  @Prop({ required: true }) contactNumber!: string;
  @Prop({ required: true }) whatsappNumber!: string;
  @Prop({ required: true }) currentLocation!: string;
  @Prop({ required: true }) linkedinId!: string;
  @Prop({ required: true }) qualification!: string;

  @Prop({ required: true, enum: Object.values(Experience) })
  experience!: Experience;

  @Prop({ required: true }) comfortableFlexibleShifts!: boolean;
  @Prop({ required: true }) lastSalary!: string;
  @Prop({ required: true }) noticePeriod!: string;
  @Prop() referredBy?: string;

  @Prop({ required: true, enum: Object.values(HearAboutUs) })
  hearAboutUs!: HearAboutUs;

  @Prop({ required: true }) resumeUrl!: string;
  @Prop({ required: true }) whyGoodFit!: string;
  @Prop({ required: true }) whyJoinUs!: string;

  @Prop() githubId?: string;
  @Prop() portfolioLink?: string;
  @Prop() technologiesKnown?: string;
  @Prop() hardestProblem?: string;

  @Prop({ type: Object, default: {} })
  customResponses!: Record<string, unknown>;

  @Prop({
    required: true,
    enum: Object.values(ApplicationStatus),
    default: ApplicationStatus.PENDING,
  })
  status!: ApplicationStatus;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);
ApplicationSchema.index({ jobId: 1, status: 1 });
ApplicationSchema.index({ createdAt: -1 });
ApplicationSchema.index({ email: 1 });
ApplicationSchema.index({ jobId: 1, email: 1 }, { unique: true });
ApplicationSchema.index({ applicantId: 1 });
```

- [ ] **Step 6: Commit**

```bash
git add src/common/enums/application-status.enum.ts src/applications/schemas/application.schema.ts src/applications/applications.service.spec.ts
git commit -m "feat: add WITHDRAWN status and applicantId field to Application schema"
```

---

## Task 3: Applicant Mongoose Schema

**Files:**
- Create: `src/applicants/schemas/applicant.schema.ts`

- [ ] **Step 1: Create the schema**

```typescript
// src/applicants/schemas/applicant.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Experience } from '../../common/enums/experience.enum';

export type ApplicantDocument = Applicant & Document;

@Schema({ timestamps: true })
export class Applicant {
  @Prop({ required: true, unique: true, lowercase: true })
  email!: string;

  @Prop({ required: true }) fullName!: string;
  @Prop({ required: true }) contactNumber!: string;
  @Prop({ required: true }) whatsappNumber!: string;
  @Prop({ required: true }) currentLocation!: string;
  @Prop({ required: true }) linkedinId!: string;
  @Prop({ required: true }) qualification!: string;

  @Prop({ required: true, enum: Object.values(Experience) })
  experience!: Experience;

  @Prop({ required: true }) resumeUrl!: string;

  // Email OTP — factor 1
  @Prop({ default: null }) otpHash!: string | null;
  @Prop({ default: null }) otpExpiresAt!: Date | null;

  // TOTP — factor 2
  @Prop({ default: null }) totpSecret!: string | null;         // AES-256 encrypted, set on confirm
  @Prop({ default: null }) pendingTotpSecret!: string | null;  // AES-256 encrypted, set on setup, cleared on confirm
  @Prop({ default: false }) totpEnabled!: boolean;
  @Prop({ type: [String], default: [] }) backupCodes!: string[]; // bcrypt hashed
  @Prop({ default: false }) mfaEnrolled!: boolean;
}

export const ApplicantSchema = SchemaFactory.createForClass(Applicant);
ApplicantSchema.index({ email: 1 }, { unique: true });
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: Only the pre-existing `scripts/seed-admin.ts` rootDir error — no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/applicants/schemas/applicant.schema.ts
git commit -m "feat: add Applicant mongoose schema"
```

---

## Task 4: Auth Infrastructure — Strategy, Guards, Decorators

**Files:**
- Create: `src/auth/strategies/applicant-jwt.strategy.ts`
- Create: `src/common/guards/applicant.guard.ts`
- Create: `src/common/guards/applicant-setup.guard.ts`
- Create: `src/common/guards/applicant-session.guard.ts`
- Create: `src/common/decorators/applicant-only.decorator.ts`
- Create: `src/common/decorators/setup-token-only.decorator.ts`
- Create: `src/common/decorators/session-token-only.decorator.ts`
- Create: `src/common/decorators/current-applicant.decorator.ts`

- [ ] **Step 1: Create `ApplicantJwtStrategy`**

```typescript
// src/auth/strategies/applicant-jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

export interface JwtApplicantUser {
  userId: string;
  email: string;
  role: string;
}

@Injectable()
export class ApplicantJwtStrategy extends PassportStrategy(Strategy, 'jwt-applicant') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('jwt.secret'),
    });
  }

  validate(payload: { sub: string; email: string; role: string }): JwtApplicantUser {
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
```

- [ ] **Step 2: Create three guards**

```typescript
// src/common/guards/applicant.guard.ts
import { Injectable, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtApplicantUser } from '../../auth/strategies/applicant-jwt.strategy';

@Injectable()
export class ApplicantGuard extends AuthGuard('jwt-applicant') {
  handleRequest<TUser = JwtApplicantUser>(err: Error | null, user: JwtApplicantUser | false): TUser {
    if (err || !user) throw err ?? new UnauthorizedException();
    if (user.role !== 'applicant') throw new ForbiddenException('Applicant access required');
    return user as unknown as TUser;
  }
}
```

```typescript
// src/common/guards/applicant-setup.guard.ts
import { Injectable, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtApplicantUser } from '../../auth/strategies/applicant-jwt.strategy';

@Injectable()
export class ApplicantSetupGuard extends AuthGuard('jwt-applicant') {
  handleRequest<TUser = JwtApplicantUser>(err: Error | null, user: JwtApplicantUser | false): TUser {
    if (err || !user) throw err ?? new UnauthorizedException();
    if (user.role !== 'applicant-setup') throw new ForbiddenException('Setup token required');
    return user as unknown as TUser;
  }
}
```

```typescript
// src/common/guards/applicant-session.guard.ts
import { Injectable, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtApplicantUser } from '../../auth/strategies/applicant-jwt.strategy';

@Injectable()
export class ApplicantSessionGuard extends AuthGuard('jwt-applicant') {
  handleRequest<TUser = JwtApplicantUser>(err: Error | null, user: JwtApplicantUser | false): TUser {
    if (err || !user) throw err ?? new UnauthorizedException();
    if (user.role !== 'applicant-session') throw new ForbiddenException('Session token required');
    return user as unknown as TUser;
  }
}
```

- [ ] **Step 3: Create decorators**

```typescript
// src/common/decorators/applicant-only.decorator.ts
import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApplicantGuard } from '../guards/applicant.guard';
export const ApplicantOnly = () => applyDecorators(UseGuards(ApplicantGuard));
```

```typescript
// src/common/decorators/setup-token-only.decorator.ts
import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApplicantSetupGuard } from '../guards/applicant-setup.guard';
export const SetupTokenOnly = () => applyDecorators(UseGuards(ApplicantSetupGuard));
```

```typescript
// src/common/decorators/session-token-only.decorator.ts
import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApplicantSessionGuard } from '../guards/applicant-session.guard';
export const SessionTokenOnly = () => applyDecorators(UseGuards(ApplicantSessionGuard));
```

```typescript
// src/common/decorators/current-applicant.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtApplicantUser } from '../../auth/strategies/applicant-jwt.strategy';

export const CurrentApplicant = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtApplicantUser => {
    const request = ctx.switchToHttp().getRequest<{ user: JwtApplicantUser }>();
    return request.user;
  },
);
```

- [ ] **Step 4: Register `ApplicantJwtStrategy` in `AuthModule`**

```typescript
// src/auth/auth.module.ts
import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import type ms from 'ms';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ApplicantJwtStrategy } from './strategies/applicant-jwt.strategy';
import { AdminModule } from '../admin/admin.module';

@Global()
@Module({
  imports: [
    AdminModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('jwt.secret'),
        signOptions: {
          expiresIn: (configService.get<string>('jwt.expiresIn') ?? '24h') as ms.StringValue,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, ApplicantJwtStrategy],
  exports: [JwtModule, PassportModule],
})
export class AuthModule {}
```

- [ ] **Step 5: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no new errors.

- [ ] **Step 6: Commit**

```bash
git add src/auth/strategies/applicant-jwt.strategy.ts \
        src/common/guards/applicant.guard.ts \
        src/common/guards/applicant-setup.guard.ts \
        src/common/guards/applicant-session.guard.ts \
        src/common/decorators/applicant-only.decorator.ts \
        src/common/decorators/setup-token-only.decorator.ts \
        src/common/decorators/session-token-only.decorator.ts \
        src/common/decorators/current-applicant.decorator.ts \
        src/auth/auth.module.ts
git commit -m "feat: add ApplicantJwtStrategy, guards, and decorators for applicant MFA auth"
```

---

## Task 5: DTOs

**Files:**
- Create: `src/applicants/dto/request-otp.dto.ts`
- Create: `src/applicants/dto/verify-otp.dto.ts`
- Create: `src/applicants/dto/verify-totp.dto.ts`
- Create: `src/applicants/dto/update-applicant.dto.ts`

- [ ] **Step 1: Create DTOs**

```typescript
// src/applicants/dto/request-otp.dto.ts
import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestOtpDto {
  @ApiProperty({ example: 'jane@example.com' })
  @IsEmail()
  email: string;
}
```

```typescript
// src/applicants/dto/verify-otp.dto.ts
import { IsEmail, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty({ example: 'jane@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '482910' })
  @IsString()
  @Length(6, 6)
  otp: string;
}
```

```typescript
// src/applicants/dto/verify-totp.dto.ts
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyTotpDto {
  @ApiProperty({ example: '482910', description: '6-digit TOTP code or XXXX-XXXX-XXXX-XXXX backup code' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(19)  // XXXX-XXXX-XXXX-XXXX = 19 chars
  code: string;
}
```

```typescript
// src/applicants/dto/update-applicant.dto.ts
import { IsString, IsEnum, IsOptional, IsUrl, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Experience } from '../../common/enums/experience.enum';

export class UpdateApplicantDto {
  @ApiPropertyOptional() @IsOptional() @IsString() @IsNotEmpty() @MaxLength(200) fullName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @IsNotEmpty() @MaxLength(100) contactNumber?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @IsNotEmpty() @MaxLength(100) whatsappNumber?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @IsNotEmpty() @MaxLength(200) currentLocation?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @IsNotEmpty() @MaxLength(500) linkedinId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @IsNotEmpty() @MaxLength(200) qualification?: string;
  @ApiPropertyOptional({ enum: Experience }) @IsOptional() @IsEnum(Experience) experience?: Experience;
  @ApiPropertyOptional() @IsOptional() @IsUrl() resumeUrl?: string;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/applicants/dto/
git commit -m "feat: add applicant DTOs (request-otp, verify-otp, verify-totp, update-applicant)"
```

---

## Task 6: MailService Additions

**Files:**
- Modify: `src/mail/mail.service.ts`

- [ ] **Step 1: Add `sendOtp()` and `sendDashboardNudge()` to MailService**

Add these two methods to the end of the `MailService` class (before the closing `}`):

```typescript
  async sendOtp(email: string, otp: string): Promise<void> {
    const html = `
      <h2>Your Login Code</h2>
      <p>Your one-time login code for MetaUpSpace is:</p>
      <h1 style="letter-spacing: 8px; font-family: monospace;">${otp}</h1>
      <p>This code expires in <strong>10 minutes</strong>.</p>
      <p>If you didn't request this, you can safely ignore this email.</p>
      <br><p>Team MetaUpSpace</p>
    `;
    await this.send(email, 'Your MetaUpSpace Login Code', html);
  }

  async sendDashboardNudge(
    email: string,
    fullName: string,
    jobTitle: string,
  ): Promise<void> {
    const html = `
      <h2>Track Your Application</h2>
      <p>Hi ${this.escapeHtml(fullName)},</p>
      <p>Your application for <strong>${this.escapeHtml(jobTitle)}</strong> has been received.</p>
      <p>You can track the status of all your applications by logging into your dashboard with your email address.</p>
      <br><p>Team MetaUpSpace</p>
    `;
    await this.send(email, 'Track Your Application — MetaUpSpace', html);
  }
```

- [ ] **Step 2: Commit**

```bash
git add src/mail/mail.service.ts
git commit -m "feat: add sendOtp and sendDashboardNudge to MailService"
```

---

## Task 7: ApplicantsService — OTP Methods

**Files:**
- Create: `src/applicants/applicants.service.ts`
- Create: `src/applicants/applicants.service.spec.ts`

- [ ] **Step 1: Write failing tests for OTP flow**

```typescript
// src/applicants/applicants.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { ApplicantsService } from './applicants.service';
import { Applicant } from './schemas/applicant.schema';
import { Application } from '../applications/schemas/application.schema';
import { MailService } from '../mail/mail.service';

const mockApplicantModel = () => ({
  findOne: jest.fn(),
  findById: jest.fn(),
  findOneAndUpdate: jest.fn(),
  find: jest.fn(),
});

const mockApplicationModel = () => ({
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
});

const mockJwtService = () => ({
  sign: jest.fn().mockReturnValue('mock-token'),
});

const mockMailService = () => ({
  sendOtp: jest.fn().mockResolvedValue(undefined),
});

const mockConfigService = () => ({
  getOrThrow: jest.fn((key: string) => {
    if (key === 'totp.encryptionKey') return 'a'.repeat(64); // 32-byte hex
    return 'mock-value';
  }),
});

describe('ApplicantsService', () => {
  let service: ApplicantsService;
  let applicantModel: ReturnType<typeof mockApplicantModel>;
  let mailService: ReturnType<typeof mockMailService>;
  let jwtService: ReturnType<typeof mockJwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicantsService,
        { provide: getModelToken(Applicant.name), useFactory: mockApplicantModel },
        { provide: getModelToken(Application.name), useFactory: mockApplicationModel },
        { provide: JwtService, useFactory: mockJwtService },
        { provide: MailService, useFactory: mockMailService },
        { provide: ConfigService, useFactory: mockConfigService },
      ],
    }).compile();

    service = module.get<ApplicantsService>(ApplicantsService);
    applicantModel = module.get(getModelToken(Applicant.name));
    mailService = module.get(MailService);
    jwtService = module.get(JwtService);
  });

  describe('requestOtp', () => {
    it('returns silently when applicant does not exist (no enumeration)', async () => {
      applicantModel.findOne.mockReturnValue({
        lean: () => ({ exec: () => Promise.resolve(null) }),
      });

      await expect(service.requestOtp('unknown@example.com')).resolves.toBeUndefined();
      expect(mailService.sendOtp).not.toHaveBeenCalled();
    });

    it('stores hashed OTP and sends email when applicant exists', async () => {
      const mockApplicant = {
        _id: 'applicant-id-1',
        email: 'jane@example.com',
        save: jest.fn().mockResolvedValue(undefined),
        otpHash: null,
        otpExpiresAt: null,
      };
      applicantModel.findOne.mockReturnValue({
        exec: () => Promise.resolve(mockApplicant),
      });

      await service.requestOtp('jane@example.com');

      expect(mockApplicant.save).toHaveBeenCalled();
      expect(mockApplicant.otpHash).not.toBeNull();
      expect(mockApplicant.otpExpiresAt).toBeInstanceOf(Date);
      expect(mailService.sendOtp).toHaveBeenCalledWith('jane@example.com', expect.stringMatching(/^\d{6}$/));
    });
  });

  describe('verifyOtp', () => {
    it('throws UnauthorizedException when OTP expired', async () => {
      const expiredDate = new Date(Date.now() - 1000);
      applicantModel.findOne.mockReturnValue({
        exec: () => Promise.resolve({
          email: 'jane@example.com',
          otpHash: 'some-hash',
          otpExpiresAt: expiredDate,
          mfaEnrolled: false,
        }),
      });

      await expect(service.verifyOtp('jane@example.com', '123456')).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when OTP hash mismatch', async () => {
      const futureDate = new Date(Date.now() + 600_000);
      applicantModel.findOne.mockReturnValue({
        exec: () => Promise.resolve({
          email: 'jane@example.com',
          otpHash: '$2b$10$invalidhash',
          otpExpiresAt: futureDate,
          mfaEnrolled: false,
        }),
      });

      await expect(service.verifyOtp('jane@example.com', '999999')).rejects.toThrow(UnauthorizedException);
    });

    it('returns requiresTotpSetup=true when OTP valid and mfaEnrolled=false', async () => {
      const bcrypt = await import('bcrypt');
      const otp = '482910';
      const hash = await bcrypt.hash(otp, 10);
      const futureDate = new Date(Date.now() + 600_000);
      const mockApplicant = {
        _id: 'applicant-id-1',
        email: 'jane@example.com',
        otpHash: hash,
        otpExpiresAt: futureDate,
        mfaEnrolled: false,
        save: jest.fn().mockResolvedValue(undefined),
      };
      applicantModel.findOne.mockReturnValue({
        exec: () => Promise.resolve(mockApplicant),
      });

      const result = await service.verifyOtp('jane@example.com', otp);

      expect(result).toEqual({ requiresTotpSetup: true, setupToken: 'mock-token' });
      expect(mockApplicant.otpHash).toBeNull();
    });

    it('returns requiresTotp=true when OTP valid and mfaEnrolled=true', async () => {
      const bcrypt = await import('bcrypt');
      const otp = '482910';
      const hash = await bcrypt.hash(otp, 10);
      const futureDate = new Date(Date.now() + 600_000);
      const mockApplicant = {
        _id: 'applicant-id-1',
        email: 'jane@example.com',
        otpHash: hash,
        otpExpiresAt: futureDate,
        mfaEnrolled: true,
        save: jest.fn().mockResolvedValue(undefined),
      };
      applicantModel.findOne.mockReturnValue({
        exec: () => Promise.resolve(mockApplicant),
      });

      const result = await service.verifyOtp('jane@example.com', otp);

      expect(result).toEqual({ requiresTotp: true, sessionToken: 'mock-token' });
    });
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx jest src/applicants/applicants.service.spec.ts
```

Expected: FAIL — `ApplicantsService` not found / cannot import.

- [ ] **Step 3: Create `ApplicantsService` with OTP methods**

```typescript
// src/applicants/applicants.service.ts
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
    const decrypted = Buffer.concat([decipher.update(Buffer.from(dataHex, 'hex')), decipher.final()]);
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
    const normalized = this.normalizeBackupCode(input);
    return /^[A-F0-9]{16}$/.test(normalized);
  }

  // ── OTP (factor 1) ──────────────────────────────────────────────────────────

  async requestOtp(email: string): Promise<void> {
    const applicant = await this.applicantModel
      .findOne({ email: email.toLowerCase() })
      .exec();

    if (!applicant) return; // silent — prevents enumeration

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

    // Consume OTP — one-time use
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
}
```

- [ ] **Step 4: Run tests to verify OTP tests pass**

```bash
npx jest src/applicants/applicants.service.spec.ts
```

Expected: all `requestOtp` and `verifyOtp` tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/applicants/applicants.service.ts src/applicants/applicants.service.spec.ts
git commit -m "feat: ApplicantsService OTP flow (requestOtp, verifyOtp)"
```

---

## Task 8: ApplicantsService — TOTP Methods

**Files:**
- Modify: `src/applicants/applicants.service.ts` (add methods)
- Modify: `src/applicants/applicants.service.spec.ts` (add tests)

- [ ] **Step 1: Add TOTP tests to spec file**

Add inside the outer `describe('ApplicantsService', ...)` block:

```typescript
  describe('withdraw', () => {
    it('throws ForbiddenException when applicantId does not match', async () => {
      const mockApp = {
        applicantId: { toString: () => 'other-id' },
        email: 'other@example.com',
        status: ApplicationStatus.PENDING,
      };
      const mockApplicant = { _id: 'my-id', email: 'jane@example.com' };
      applicantModel.findById.mockReturnValue({ exec: () => Promise.resolve(mockApplicant) });
      (module.get(getModelToken(Application.name)) as any).findById.mockReturnValue({
        exec: () => Promise.resolve(mockApp),
      });

      await expect(service.withdraw('app-id', 'my-id')).rejects.toThrow(ForbiddenException);
    });

    it('throws ConflictException when status is SHORTLISTED', async () => {
      const mockApp = {
        applicantId: { toString: () => 'my-id' },
        email: 'jane@example.com',
        status: ApplicationStatus.SHORTLISTED,
      };
      const mockApplicant = { _id: { toString: () => 'my-id' }, email: 'jane@example.com' };
      applicantModel.findById.mockReturnValue({ exec: () => Promise.resolve(mockApplicant) });
      (module.get(getModelToken(Application.name)) as any).findById.mockReturnValue({
        exec: () => Promise.resolve(mockApp),
      });

      await expect(service.withdraw('app-id', 'my-id')).rejects.toThrow(ConflictException);
    });

    it('sets status WITHDRAWN when pending and owned by applicant', async () => {
      const mockApp = {
        applicantId: { toString: () => 'my-id' },
        email: 'jane@example.com',
        status: ApplicationStatus.PENDING,
        save: jest.fn().mockResolvedValue(undefined),
      };
      const mockApplicant = { _id: { toString: () => 'my-id' }, email: 'jane@example.com' };
      applicantModel.findById.mockReturnValue({ exec: () => Promise.resolve(mockApplicant) });
      (module.get(getModelToken(Application.name)) as any).findById.mockReturnValue({
        exec: () => Promise.resolve(mockApp),
      });

      await service.withdraw('app-id', 'my-id');

      expect(mockApp.status).toBe(ApplicationStatus.WITHDRAWN);
      expect(mockApp.save).toHaveBeenCalled();
    });
  });
```

Note: `module` must be hoisted to `let module: TestingModule` at the `describe` scope and assigned in `beforeEach`.

Replace the `beforeEach` block in the spec to hoist `module`:

```typescript
  // at describe('ApplicantsService') scope:
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        ApplicantsService,
        { provide: getModelToken(Applicant.name), useFactory: mockApplicantModel },
        { provide: getModelToken(Application.name), useFactory: mockApplicationModel },
        { provide: JwtService, useFactory: mockJwtService },
        { provide: MailService, useFactory: mockMailService },
        { provide: ConfigService, useFactory: mockConfigService },
      ],
    }).compile();

    service = module.get<ApplicantsService>(ApplicantsService);
    applicantModel = module.get(getModelToken(Applicant.name));
    mailService = module.get(MailService);
    jwtService = module.get(JwtService);
  });
```

- [ ] **Step 2: Run tests to verify new tests fail**

```bash
npx jest src/applicants/applicants.service.spec.ts
```

Expected: new `withdraw` tests FAIL — `service.withdraw is not a function`.

- [ ] **Step 3: Add TOTP methods and dashboard methods to `ApplicantsService`**

Add these methods to `ApplicantsService` (after `verifyOtp`):

```typescript
  // ── TOTP (factor 2) ─────────────────────────────────────────────────────────

  async setupTotp(applicantId: string): Promise<{ qrCodeUri: string; qrCodeDataUrl: string; secret: string }> {
    const applicant = await this.applicantModel.findById(applicantId).exec();
    if (!applicant) throw new NotFoundException('Applicant not found');

    const generated = speakeasy.generateSecret({
      name: `MetaUpSpace (${applicant.email})`,
      length: 20,
    });

    // Store encrypted pending secret on the doc — confirmTotp reads it from here
    applicant.pendingTotpSecret = this.encryptTotp(generated.base32);
    await applicant.save();

    const qrCodeDataUrl = await QRCode.toDataURL(generated.otpauth_url!);

    return {
      qrCodeUri: generated.otpauth_url!,
      qrCodeDataUrl,
      secret: generated.base32, // returned for manual entry in authenticator apps
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
    applicant.pendingTotpSecret = null; // consumed — clear it
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

  async getProfile(applicantId: string): Promise<Omit<ApplicantDocument, 'otpHash' | 'totpSecret' | 'backupCodes'>> {
    const applicant = await this.applicantModel
      .findById(applicantId)
      .select('-otpHash -totpSecret -backupCodes')
      .exec();
    if (!applicant) throw new NotFoundException('Applicant not found');
    return applicant as unknown as Omit<ApplicantDocument, 'otpHash' | 'totpSecret' | 'backupCodes'>;
  }

  async updateProfile(applicantId: string, dto: UpdateApplicantDto): Promise<ApplicantDocument> {
    const applicant = await this.applicantModel
      .findByIdAndUpdate(applicantId, dto, { new: true })
      .select('-otpHash -totpSecret -backupCodes')
      .exec();
    if (!applicant) throw new NotFoundException('Applicant not found');
    return applicant;
  }

  async getMyApplications(applicantId: string, email: string): Promise<{
    applicationId: string;
    jobTitle: string;
    jobSlug: string;
    status: ApplicationStatus;
    appliedAt: Date;
  }[]> {
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
      (application.applicantId && application.applicantId.toString() === applicantId) ||
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
```

- [ ] **Step 4: Run all tests to verify they pass**

```bash
npx jest src/applicants/applicants.service.spec.ts
```

Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/applicants/applicants.service.ts src/applicants/applicants.service.spec.ts
git commit -m "feat: ApplicantsService TOTP and dashboard methods (setupTotp, confirmTotp, verifyTotp, withdraw)"
```

---

## Task 9: ApplicantsController

**Files:**
- Create: `src/applicants/applicants.controller.ts`

- [ ] **Step 1: Create the controller**

```typescript
// src/applicants/applicants.controller.ts
import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  HttpCode,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ApplicantsService } from './applicants.service';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { VerifyTotpDto } from './dto/verify-totp.dto';
import { UpdateApplicantDto } from './dto/update-applicant.dto';
import { ApplicantOnly } from '../common/decorators/applicant-only.decorator';
import { SetupTokenOnly } from '../common/decorators/setup-token-only.decorator';
import { SessionTokenOnly } from '../common/decorators/session-token-only.decorator';
import { CurrentApplicant } from '../common/decorators/current-applicant.decorator';
import { JwtApplicantUser } from '../auth/strategies/applicant-jwt.strategy';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';
import { ResponseMessage } from '../common/decorators/response-message.decorator';

@ApiTags('Applicants')
@Controller('applicants')
export class ApplicantsController {
  constructor(private readonly applicantsService: ApplicantsService) {}

  // ── Auth ────────────────────────────────────────────────────────────────────

  @Post('request-otp')
  @HttpCode(200)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ResponseMessage('If that email is registered, an OTP has been sent')
  @ApiOperation({ summary: 'Request email OTP (factor 1)' })
  @ApiResponse({ status: 200 })
  requestOtp(@Body() dto: RequestOtpDto) {
    return this.applicantsService.requestOtp(dto.email);
  }

  @Post('verify-otp')
  @HttpCode(200)
  @Throttle({ default: { limit: 5, ttl: 900000 } }) // 5 per 15 min
  @ResponseMessage('OTP verified')
  @ApiOperation({ summary: 'Verify email OTP — returns setupToken or sessionToken' })
  @ApiResponse({ status: 200 })
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.applicantsService.verifyOtp(dto.email, dto.otp);
  }

  @Post('setup-totp')
  @HttpCode(200)
  @SetupTokenOnly()
  @ResponseMessage('TOTP setup initiated')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate TOTP secret + QR code (requires setupToken)' })
  @ApiResponse({ status: 200, description: '{ qrCodeUri, qrCodeDataUrl, secret }' })
  setupTotp(@CurrentApplicant() user: JwtApplicantUser) {
    return this.applicantsService.setupTotp(user.userId);
  }

  @Post('confirm-totp')
  @HttpCode(200)
  @SetupTokenOnly()
  @ResponseMessage('TOTP enrolled. Save your backup codes — they will not be shown again.')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Confirm TOTP enrollment (requires setupToken + TOTP code)' })
  @ApiResponse({ status: 200, description: '{ accessToken, backupCodes }' })
  confirmTotp(
    @CurrentApplicant() user: JwtApplicantUser,
    @Body() dto: VerifyTotpDto,
  ) {
    // pendingTotpSecret is stored on Applicant doc by setup-totp — no secret in JWT needed
    return this.applicantsService.confirmTotp(user.userId, dto.code);
  }

  @Post('verify-totp')
  @HttpCode(200)
  @SessionTokenOnly()
  @ResponseMessage('Authentication successful')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify TOTP code or backup code (requires sessionToken)' })
  @ApiResponse({ status: 200, description: '{ accessToken }' })
  verifyTotp(
    @CurrentApplicant() user: JwtApplicantUser,
    @Body() dto: VerifyTotpDto,
  ) {
    return this.applicantsService.verifyTotp(user.userId, dto.code);
  }

  // ── Dashboard ────────────────────────────────────────────────────────────────

  @Get('me')
  @ApplicantOnly()
  @ResponseMessage('Profile fetched')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get own profile' })
  getProfile(@CurrentApplicant() user: JwtApplicantUser) {
    return this.applicantsService.getProfile(user.userId);
  }

  @Patch('me')
  @ApplicantOnly()
  @ResponseMessage('Profile updated')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update own profile (email not patchable)' })
  updateProfile(
    @CurrentApplicant() user: JwtApplicantUser,
    @Body() dto: UpdateApplicantDto,
  ) {
    return this.applicantsService.updateProfile(user.userId, dto);
  }

  @Get('me/applications')
  @ApplicantOnly()
  @ResponseMessage('Applications fetched')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all own applications with status' })
  getMyApplications(@CurrentApplicant() user: JwtApplicantUser) {
    return this.applicantsService.getMyApplications(user.userId, user.email);
  }

  @Post('me/applications/:id/withdraw')
  @HttpCode(200)
  @ApplicantOnly()
  @ResponseMessage('Application withdrawn')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Withdraw a pending/reviewed application' })
  @ApiResponse({ status: 409, description: 'Cannot withdraw SHORTLISTED/HIRED/REJECTED application' })
  withdraw(
    @CurrentApplicant() user: JwtApplicantUser,
    @Param('id', ParseMongoIdPipe) id: string,
  ) {
    return this.applicantsService.withdraw(id, user.userId);
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/applicants/applicants.controller.ts
git commit -m "feat: ApplicantsController — all OTP/TOTP auth + dashboard routes"
```

---

## Task 10: ApplicantsModule + AppModule Wire-Up

**Files:**
- Create: `src/applicants/applicants.module.ts`
- Modify: `src/app.module.ts`

- [ ] **Step 1: Create `ApplicantsModule`**

```typescript
// src/applicants/applicants.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Applicant, ApplicantSchema } from './schemas/applicant.schema';
import { Application, ApplicationSchema } from '../applications/schemas/application.schema';
import { ApplicantsService } from './applicants.service';
import { ApplicantsController } from './applicants.controller';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Applicant.name, schema: ApplicantSchema },
      { name: Application.name, schema: ApplicationSchema },
    ]),
    MailModule,
  ],
  controllers: [ApplicantsController],
  providers: [ApplicantsService],
  exports: [MongooseModule],
})
export class ApplicantsModule {}
```

- [ ] **Step 2: Add `ApplicantsModule` to `AppModule`**

```typescript
// src/app.module.ts
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import configuration from './config/configuration';
import { AuthModule } from './auth/auth.module';
import { JobsModule } from './jobs/jobs.module';
import { ApplicationsModule } from './applications/applications.module';
import { ApplicantsModule } from './applicants/applicants.module';
import { UploadModule } from './upload/upload.module';
import { MailModule } from './mail/mail.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('mongodb.uri'),
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    AdminModule,
    AuthModule,
    JobsModule,
    ApplicationsModule,
    ApplicantsModule,
    UploadModule,
    MailModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: only pre-existing `scripts/seed-admin.ts` rootDir error.

- [ ] **Step 4: Run all tests**

```bash
npx jest
```

Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/applicants/applicants.module.ts src/app.module.ts
git commit -m "feat: wire ApplicantsModule into AppModule"
```

---

## Task 11: ApplicationsService — Upsert Applicant on Submit

**Files:**
- Modify: `src/applications/applications.service.ts`
- Modify: `src/applications/applications.module.ts`

- [ ] **Step 1: Add `Applicant` model to `ApplicationsModule`**

```typescript
// src/applications/applications.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { AdminApplicationsController } from './admin-applications.controller';
import { Application, ApplicationSchema } from './schemas/application.schema';
import { Applicant, ApplicantSchema } from '../applicants/schemas/applicant.schema';
import { JobsModule } from '../jobs/jobs.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Application.name, schema: ApplicationSchema },
      { name: Applicant.name, schema: ApplicantSchema },
    ]),
    JobsModule,
    MailModule,
  ],
  controllers: [ApplicationsController, AdminApplicationsController],
  providers: [ApplicationsService],
  exports: [ApplicationsService],
})
export class ApplicationsModule {}
```

- [ ] **Step 2: Inject `ApplicantModel` into `ApplicationsService` and update `create()`**

Add the import and inject at the top of `ApplicationsService`, then update `create()`:

```typescript
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
      throw new BadRequestException('This job is no longer accepting applications');
    }

    if (job.type === JobType.TECH) {
      const techFields = ['githubId', 'portfolioLink', 'technologiesKnown', 'hardestProblem'] as const;
      const missing = techFields.filter((f) => !dto[f]);
      if (missing.length) {
        throw new BadRequestException(`Missing required tech fields: ${missing.join(', ')}`);
      }
    }

    const missingCustom = job.customFields
      .filter((f) => f.required && (!dto.customResponses || dto.customResponses[f.fieldId] == null))
      .map((f) => f.label);

    if (missingCustom.length) {
      throw new BadRequestException(`Missing required fields: ${missingCustom.join(', ')}`);
    }

    const duplicate = await this.applicationModel
      .findOne({ jobId: job._id, email: dto.email })
      .lean()
      .exec();
    if (duplicate) {
      throw new ConflictException('You have already applied for this job');
    }

    // Upsert applicant profile — create on first apply, update resumeUrl on subsequent
    const applicant = await this.applicantModel.findOneAndUpdate(
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
    ).exec();

    const application = await this.applicationModel.create({
      ...dto,
      jobId: job._id,
      applicantId: applicant!._id,
      status: ApplicationStatus.PENDING,
    });

    void this.mailService
      .sendApplicationConfirmationToCandidate(dto.email, dto.fullName, job.title)
      .catch((err) => this.logger.error('Candidate confirmation email failed', err));

    void this.mailService
      .sendNewApplicationAlertToAdmin(dto.fullName, dto.email, job.title)
      .catch((err) => this.logger.error('Admin alert email failed', err));

    void this.mailService
      .sendDashboardNudge(dto.email, dto.fullName, job.title)
      .catch((err) => this.logger.error('Dashboard nudge email failed', err));

    return application;
  }

  // ... rest of existing methods unchanged (findAll, findOne, updateStatus, checkStatus, findByEmail, remove)
```

> **Important:** Keep all existing methods (`findAll`, `findOne`, `updateStatus`, `checkStatus`, `findByEmail`, `remove`) exactly as they are below the `create()` method. Only `create()` and the constructor change.

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: only pre-existing rootDir error.

- [ ] **Step 4: Run all tests**

```bash
npx jest
```

Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/applications/applications.service.ts src/applications/applications.module.ts
git commit -m "feat: upsert Applicant profile on application submit, link applicantId"
```

---

## Task 12: Final Build Verification

**Files:** none new

- [ ] **Step 1: Run full test suite**

```bash
npx jest --coverage
```

Expected: all tests PASS. No uncovered critical paths.

- [ ] **Step 2: Build**

```bash
npx nest build
```

Expected: exits with code 0, `dist/` folder populated.

- [ ] **Step 3: Smoke-test route registration (dev server)**

```bash
npx nest start
```

Hit `GET /` — server starts. Check Swagger at `http://localhost:3000/api` — confirm:
- `Applicants` tag visible
- Routes: `POST /applicants/request-otp`, `POST /applicants/verify-otp`, `POST /applicants/setup-totp`, `POST /applicants/confirm-totp`, `POST /applicants/verify-totp`, `GET /applicants/me`, `PATCH /applicants/me`, `GET /applicants/me/applications`, `POST /applicants/me/applications/:id/withdraw`

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete applicant identity & dashboard — OTP+TOTP MFA, profile, applications, withdraw"
```
