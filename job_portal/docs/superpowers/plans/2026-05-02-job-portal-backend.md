# Job Portal Backend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a modular NestJS backend for MetaUpSpace's job portal with job listings, candidate applications, Cloudinary resume uploads, JWT admin auth, and Nodemailer email notifications.

**Architecture:** Monolithic modular NestJS app — Auth, Jobs, Applications, Upload, and Mail are independent modules with one-way dependencies. MongoDB via Mongoose. Admin-only JWT guards all write operations on jobs and all application reads; application submission is public.

**Tech Stack:** NestJS v10 · MongoDB/Mongoose · Cloudinary · Nodemailer · passport-jwt · class-validator · @nestjs/throttler · helmet

---

## File Map

```
src/
├── main.ts
├── app.module.ts
├── config/
│   └── configuration.ts
├── common/
│   ├── enums/
│   │   ├── experience.enum.ts
│   │   ├── hear-about-us.enum.ts
│   │   ├── application-status.enum.ts
│   │   ├── field-type.enum.ts
│   │   └── job-type.enum.ts
│   ├── filters/
│   │   └── http-exception.filter.ts
│   ├── guards/
│   │   └── jwt-auth.guard.ts
│   └── decorators/
│       └── admin-only.decorator.ts
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.service.spec.ts
│   ├── dto/
│   │   └── login.dto.ts
│   └── strategies/
│       └── jwt.strategy.ts
├── jobs/
│   ├── jobs.module.ts
│   ├── jobs.controller.ts
│   ├── admin-jobs.controller.ts
│   ├── jobs.service.ts
│   ├── jobs.service.spec.ts
│   ├── schemas/
│   │   └── job.schema.ts
│   └── dto/
│       ├── field-definition.dto.ts
│       ├── create-job.dto.ts
│       └── update-job.dto.ts
├── applications/
│   ├── applications.module.ts
│   ├── applications.controller.ts
│   ├── admin-applications.controller.ts
│   ├── applications.service.ts
│   ├── applications.service.spec.ts
│   ├── schemas/
│   │   └── application.schema.ts
│   └── dto/
│       ├── create-application.dto.ts
│       ├── update-status.dto.ts
│       └── query-applications.dto.ts
├── upload/
│   ├── upload.module.ts
│   ├── upload.controller.ts
│   └── upload.service.ts
└── mail/
    ├── mail.module.ts
    └── mail.service.ts
```

---

### Task 1: Project Bootstrap & Dependencies

**Files:**
- Modify: `src/app.module.ts` (replace default)
- Modify: `src/main.ts` (replace default)
- Delete: `src/app.controller.ts`, `src/app.service.ts`, `src/app.controller.spec.ts`

- [ ] **Step 1: Scaffold NestJS project inside job_portal folder**

Run inside `C:\Users\naksh\Desktop\Metaupspace\job_portal`:
```bash
npx @nestjs/cli new . --package-manager npm --skip-git
```
When prompted "The directory is not empty. Overwrite?" — select **Yes**.

Expected: NestJS project created with `src/`, `package.json`, `tsconfig.json`.

- [ ] **Step 2: Install all production dependencies**

```bash
npm install @nestjs/mongoose mongoose @nestjs/jwt @nestjs/passport passport passport-jwt @nestjs/config class-validator class-transformer cloudinary multer @nestjs/platform-express nodemailer @nestjs/throttler helmet @nestjs/mapped-types
```

- [ ] **Step 3: Install dev dependencies**

```bash
npm install -D @types/passport-jwt @types/multer @types/nodemailer
```

- [ ] **Step 4: Enable class-validator transform in tsconfig**

Verify `tsconfig.json` has these (NestJS CLI sets them by default — just confirm):
```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "esModuleInterop": true
  }
}
```

- [ ] **Step 5: Delete default boilerplate files**

```bash
del src\app.controller.ts src\app.service.ts src\app.controller.spec.ts
```

- [ ] **Step 6: Verify project compiles**

```bash
npx nest build
```
Expected: `dist/` folder created, no errors.

- [ ] **Step 7: Commit**

```bash
git init
git add .
git commit -m "chore: bootstrap NestJS project with all dependencies"
```

---

### Task 2: Configuration Module

**Files:**
- Create: `src/config/configuration.ts`

- [ ] **Step 1: Create configuration factory**

```typescript
// src/config/configuration.ts
export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  mongodb: {
    uri: process.env.MONGODB_URI,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
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
    origin: process.env.CORS_ORIGIN || '*',
  },
});
```

- [ ] **Step 2: Commit**

```bash
git add src/config/configuration.ts
git commit -m "feat: add configuration factory"
```

---

### Task 3: Common Enums, Exception Filter, Guard & Decorator

**Files:**
- Create: `src/common/enums/experience.enum.ts`
- Create: `src/common/enums/hear-about-us.enum.ts`
- Create: `src/common/enums/application-status.enum.ts`
- Create: `src/common/enums/field-type.enum.ts`
- Create: `src/common/enums/job-type.enum.ts`
- Create: `src/common/filters/http-exception.filter.ts`
- Create: `src/common/guards/jwt-auth.guard.ts`
- Create: `src/common/decorators/admin-only.decorator.ts`

- [ ] **Step 1: Create enums**

```typescript
// src/common/enums/experience.enum.ts
export enum Experience {
  FRESHER = 'fresher',
  ZERO_TO_ONE = '0-1',
  ONE_TO_THREE = '1-3',
  THREE_TO_FIVE = '3-5',
}
```

```typescript
// src/common/enums/hear-about-us.enum.ts
export enum HearAboutUs {
  LINKEDIN_POST = 'linkedin_post',
  LINKEDIN_COMPANY = 'linkedin_company',
  JOB_PORTAL = 'job_portal',
  WHATSAPP_TELEGRAM = 'whatsapp_telegram',
  COMPANY_WEBSITE = 'company_website',
  OTHER = 'other',
}
```

```typescript
// src/common/enums/application-status.enum.ts
export enum ApplicationStatus {
  PENDING = 'pending',
  REVIEWED = 'reviewed',
  SHORTLISTED = 'shortlisted',
  REJECTED = 'rejected',
  HIRED = 'hired',
}
```

```typescript
// src/common/enums/field-type.enum.ts
export enum FieldType {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  SELECT = 'select',
  BOOLEAN = 'boolean',
  NUMBER = 'number',
}
```

```typescript
// src/common/enums/job-type.enum.ts
export enum JobType {
  TECH = 'tech',
  NON_TECH = 'non-tech',
}
```

- [ ] **Step 2: Create global exception filter**

```typescript
// src/common/filters/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as any)?.message ?? 'Internal server error';

    const errors =
      typeof exceptionResponse === 'object' && Array.isArray((exceptionResponse as any)?.message)
        ? (exceptionResponse as any).message
        : undefined;

    response.status(status).json({
      statusCode: status,
      message: Array.isArray(message) ? 'Validation failed' : message,
      errors,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
```

- [ ] **Step 3: Create JWT auth guard**

```typescript
// src/common/guards/jwt-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

- [ ] **Step 4: Create AdminOnly decorator**

```typescript
// src/common/decorators/admin-only.decorator.ts
import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

export const AdminOnly = () => applyDecorators(UseGuards(JwtAuthGuard));
```

- [ ] **Step 5: Commit**

```bash
git add src/common/
git commit -m "feat: add common enums, exception filter, JWT guard and AdminOnly decorator"
```

---

### Task 4: Auth Module

**Files:**
- Create: `src/auth/dto/login.dto.ts`
- Create: `src/auth/strategies/jwt.strategy.ts`
- Create: `src/auth/auth.service.spec.ts`
- Create: `src/auth/auth.service.ts`
- Create: `src/auth/auth.controller.ts`
- Create: `src/auth/auth.module.ts`

- [ ] **Step 1: Create login DTO**

```typescript
// src/auth/dto/login.dto.ts
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
```

- [ ] **Step 2: Write failing auth service test**

```typescript
// src/auth/auth.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: jest.Mocked<Pick<JwtService, 'sign'>>;

  const mockConfigService = {
    get: (key: string) => {
      const map: Record<string, string> = {
        'admin.email': 'admin@test.com',
        'admin.password': 'password123',
      };
      return map[key];
    },
  };

  const mockJwtService = { sign: jest.fn().mockReturnValue('mock.jwt.token') };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get(JwtService);
    jest.clearAllMocks();
  });

  it('returns access_token on valid credentials', async () => {
    mockJwtService.sign.mockReturnValue('mock.jwt.token');
    const result = await service.login({ email: 'admin@test.com', password: 'password123' });
    expect(result).toEqual({ access_token: 'mock.jwt.token' });
    expect(mockJwtService.sign).toHaveBeenCalledWith({ email: 'admin@test.com', role: 'admin' });
  });

  it('throws UnauthorizedException on wrong email', async () => {
    await expect(
      service.login({ email: 'wrong@test.com', password: 'password123' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('throws UnauthorizedException on wrong password', async () => {
    await expect(
      service.login({ email: 'admin@test.com', password: 'wrongpass' }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
```

- [ ] **Step 3: Run test — expect failure (module not found)**

```bash
npx jest src/auth/auth.service.spec.ts --no-coverage
```
Expected: FAIL — `Cannot find module './auth.service'`

- [ ] **Step 4: Implement auth service**

```typescript
// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const adminEmail = this.configService.get<string>('admin.email');
    const adminPassword = this.configService.get<string>('admin.password');

    if (loginDto.email !== adminEmail || loginDto.password !== adminPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: loginDto.email, role: 'admin' };
    return { access_token: this.jwtService.sign(payload) };
  }
}
```

- [ ] **Step 5: Run test — expect all pass**

```bash
npx jest src/auth/auth.service.spec.ts --no-coverage
```
Expected: PASS — 3 tests passing.

- [ ] **Step 6: Create JWT strategy**

```typescript
// src/auth/strategies/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret'),
    });
  }

  async validate(payload: { email: string; role: string }) {
    return { email: payload.email, role: payload.role };
  }
}
```

- [ ] **Step 7: Create auth controller**

```typescript
// src/auth/auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
```

- [ ] **Step 8: Create auth module**

```typescript
// src/auth/auth.module.ts
import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Global()
@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: { expiresIn: configService.get<string>('jwt.expiresIn') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtModule],
})
export class AuthModule {}
```

- [ ] **Step 9: Commit**

```bash
git add src/auth/
git commit -m "feat: add auth module with JWT login"
```

---

### Task 5: Jobs Schema & DTOs

**Files:**
- Create: `src/jobs/schemas/job.schema.ts`
- Create: `src/jobs/dto/field-definition.dto.ts`
- Create: `src/jobs/dto/create-job.dto.ts`
- Create: `src/jobs/dto/update-job.dto.ts`

- [ ] **Step 1: Create job schema**

```typescript
// src/jobs/schemas/job.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { JobType } from '../../common/enums/job-type.enum';
import { FieldType } from '../../common/enums/field-type.enum';

export type JobDocument = Job & Document;

@Schema({ _id: false })
export class FieldDefinition {
  @Prop({ required: true }) fieldId: string;
  @Prop({ required: true }) label: string;
  @Prop({ required: true, enum: Object.values(FieldType) }) fieldType: FieldType;
  @Prop({ default: false }) required: boolean;
  @Prop({ type: [String], default: [] }) options: string[];
}

export const FieldDefinitionSchema = SchemaFactory.createForClass(FieldDefinition);

@Schema({ timestamps: true })
export class Job {
  @Prop({ required: true }) title: string;
  @Prop({ required: true, unique: true }) slug: string;
  @Prop({ required: true }) description: string;
  @Prop({ required: true }) domain: string;
  @Prop({ required: true, enum: Object.values(JobType) }) type: JobType;
  @Prop({ default: true }) isActive: boolean;
  @Prop({ type: [String], default: [] }) requirements: string[];
  @Prop({ type: [FieldDefinitionSchema], default: [] }) customFields: FieldDefinition[];
}

export const JobSchema = SchemaFactory.createForClass(Job);
```

- [ ] **Step 2: Create field definition DTO**

```typescript
// src/jobs/dto/field-definition.dto.ts
import {
  IsString,
  IsEnum,
  IsBoolean,
  IsArray,
  IsOptional,
} from 'class-validator';
import { FieldType } from '../../common/enums/field-type.enum';

export class FieldDefinitionDto {
  @IsString()
  fieldId: string;

  @IsString()
  label: string;

  @IsEnum(FieldType)
  fieldType: FieldType;

  @IsBoolean()
  @IsOptional()
  required?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  options?: string[];
}
```

- [ ] **Step 3: Create create-job DTO**

```typescript
// src/jobs/dto/create-job.dto.ts
import {
  IsString,
  IsEnum,
  IsArray,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { JobType } from '../../common/enums/job-type.enum';
import { FieldDefinitionDto } from './field-definition.dto';

export class CreateJobDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  domain: string;

  @IsEnum(JobType)
  type: JobType;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  requirements?: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FieldDefinitionDto)
  @IsOptional()
  customFields?: FieldDefinitionDto[];
}
```

- [ ] **Step 4: Create update-job DTO**

```typescript
// src/jobs/dto/update-job.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateJobDto } from './create-job.dto';

export class UpdateJobDto extends PartialType(CreateJobDto) {
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
```

- [ ] **Step 5: Commit**

```bash
git add src/jobs/schemas/ src/jobs/dto/
git commit -m "feat: add jobs schema and DTOs"
```

---

### Task 6: Jobs Service (TDD)

**Files:**
- Create: `src/jobs/jobs.service.spec.ts`
- Create: `src/jobs/jobs.service.ts`

- [ ] **Step 1: Write failing jobs service tests**

```typescript
// src/jobs/jobs.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
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

const execMock = jest.fn();
const mockJobModel = {
  create: jest.fn(),
  find: jest.fn().mockReturnValue({ exec: execMock }),
  findById: jest.fn().mockReturnValue({ exec: execMock }),
  findByIdAndUpdate: jest.fn().mockReturnValue({ exec: execMock }),
};

describe('JobsService', () => {
  let service: JobsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobsService,
        { provide: getModelToken(Job.name), useValue: mockJobModel },
      ],
    }).compile();

    service = module.get<JobsService>(JobsService);
    jest.clearAllMocks();
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
          slug: expect.stringMatching(/^backend-developer-/),
        }),
      );
      expect(result).toEqual(mockJob);
    });
  });

  describe('findAllActive', () => {
    it('queries only isActive: true', async () => {
      mockJobModel.find.mockReturnValue({ exec: jest.fn().mockResolvedValue([mockJob]) });
      const result = await service.findAllActive();
      expect(mockJobModel.find).toHaveBeenCalledWith({ isActive: true });
      expect(result).toEqual([mockJob]);
    });
  });

  describe('findAllAdmin', () => {
    it('queries all jobs without filter', async () => {
      mockJobModel.find.mockReturnValue({ exec: jest.fn().mockResolvedValue([mockJob]) });
      await service.findAllAdmin();
      expect(mockJobModel.find).toHaveBeenCalledWith();
    });
  });

  describe('findOne', () => {
    it('returns job when found', async () => {
      mockJobModel.findById.mockReturnValue({ exec: jest.fn().mockResolvedValue(mockJob) });
      const result = await service.findOne('job-id-1');
      expect(result).toEqual(mockJob);
    });

    it('throws NotFoundException when job does not exist', async () => {
      mockJobModel.findById.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
      await expect(service.findOne('nonexistent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('returns updated job', async () => {
      const updated = { ...mockJob, domain: 'DevOps' };
      mockJobModel.findByIdAndUpdate.mockReturnValue({ exec: jest.fn().mockResolvedValue(updated) });
      const result = await service.update('job-id-1', { domain: 'DevOps' });
      expect(mockJobModel.findByIdAndUpdate).toHaveBeenCalledWith('job-id-1', { domain: 'DevOps' }, { new: true });
      expect(result.domain).toBe('DevOps');
    });

    it('throws NotFoundException when job does not exist', async () => {
      mockJobModel.findByIdAndUpdate.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
      await expect(service.update('nonexistent-id', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('softDelete', () => {
    it('sets isActive to false', async () => {
      const deleted = { ...mockJob, isActive: false };
      mockJobModel.findByIdAndUpdate.mockReturnValue({ exec: jest.fn().mockResolvedValue(deleted) });
      const result = await service.softDelete('job-id-1');
      expect(mockJobModel.findByIdAndUpdate).toHaveBeenCalledWith('job-id-1', { isActive: false }, { new: true });
      expect(result.isActive).toBe(false);
    });
  });
});
```

- [ ] **Step 2: Run test — expect failure**

```bash
npx jest src/jobs/jobs.service.spec.ts --no-coverage
```
Expected: FAIL — `Cannot find module './jobs.service'`

- [ ] **Step 3: Implement jobs service**

```typescript
// src/jobs/jobs.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
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
    return this.jobModel.create({ ...createJobDto, slug });
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

  async update(id: string, updateJobDto: UpdateJobDto): Promise<JobDocument> {
    const job = await this.jobModel
      .findByIdAndUpdate(id, updateJobDto, { new: true })
      .exec();
    if (!job) throw new NotFoundException(`Job ${id} not found`);
    return job;
  }

  async softDelete(id: string): Promise<JobDocument> {
    return this.update(id, { isActive: false });
  }
}
```

- [ ] **Step 4: Run tests — expect all pass**

```bash
npx jest src/jobs/jobs.service.spec.ts --no-coverage
```
Expected: PASS — 7 tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/jobs/jobs.service.ts src/jobs/jobs.service.spec.ts
git commit -m "feat: add jobs service with TDD"
```

---

### Task 7: Jobs Controllers & Module

**Files:**
- Create: `src/jobs/jobs.controller.ts`
- Create: `src/jobs/admin-jobs.controller.ts`
- Create: `src/jobs/jobs.module.ts`

- [ ] **Step 1: Create public jobs controller**

```typescript
// src/jobs/jobs.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { JobsService } from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  findAllActive() {
    return this.jobsService.findAllActive();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }
}
```

- [ ] **Step 2: Create admin jobs controller**

```typescript
// src/jobs/admin-jobs.controller.ts
import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { AdminOnly } from '../common/decorators/admin-only.decorator';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@Controller('admin/jobs')
export class AdminJobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  @AdminOnly()
  findAll() {
    return this.jobsService.findAllAdmin();
  }

  @Post()
  @AdminOnly()
  create(@Body() createJobDto: CreateJobDto) {
    return this.jobsService.create(createJobDto);
  }

  @Patch(':id')
  @AdminOnly()
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobsService.update(id, updateJobDto);
  }

  @Delete(':id')
  @AdminOnly()
  softDelete(@Param('id') id: string) {
    return this.jobsService.softDelete(id);
  }
}
```

- [ ] **Step 3: Create jobs module**

```typescript
// src/jobs/jobs.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Job, JobSchema } from './schemas/job.schema';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { AdminJobsController } from './admin-jobs.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Job.name, schema: JobSchema }])],
  controllers: [JobsController, AdminJobsController],
  providers: [JobsService],
  exports: [JobsService],
})
export class JobsModule {}
```

- [ ] **Step 4: Commit**

```bash
git add src/jobs/jobs.controller.ts src/jobs/admin-jobs.controller.ts src/jobs/jobs.module.ts
git commit -m "feat: add jobs controllers and module"
```

---

### Task 8: Upload Module (Cloudinary + Multer)

**Files:**
- Create: `src/upload/upload.service.ts`
- Create: `src/upload/upload.controller.ts`
- Create: `src/upload/upload.module.ts`

- [ ] **Step 1: Create upload service**

```typescript
// src/upload/upload.service.ts
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
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
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw',
          folder: 'metaupspace/resumes',
          public_id: `${Date.now()}-${sanitizedName}`,
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
```

- [ ] **Step 2: Create upload controller**

```typescript
// src/upload/upload.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UploadService } from './upload.service';

const ALLOWED_MIMETYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('resume')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        if (ALLOWED_MIMETYPES.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Only PDF and Word documents are allowed'), false);
        }
      },
    }),
  )
  async upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file provided');
    const url = await this.uploadService.uploadResume(file.buffer, file.originalname);
    return { url };
  }
}
```

- [ ] **Step 3: Create upload module**

```typescript
// src/upload/upload.module.ts
import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';

@Module({
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
```

- [ ] **Step 4: Commit**

```bash
git add src/upload/
git commit -m "feat: add upload module with Cloudinary resume upload"
```

---

### Task 9: Mail Module (Nodemailer)

**Files:**
- Create: `src/mail/mail.service.ts`
- Create: `src/mail/mail.module.ts`

- [ ] **Step 1: Create mail service**

```typescript
// src/mail/mail.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { ApplicationStatus } from '../common/enums/application-status.enum';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;
  private fromAddress: string;

  constructor(private readonly configService: ConfigService) {
    const user = configService.get<string>('mail.user');
    this.fromAddress = `"MetaUpSpace Careers" <${user}>`;
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass: configService.get<string>('mail.pass'),
      },
    });
  }

  private async send(to: string, subject: string, html: string): Promise<void> {
    try {
      await this.transporter.sendMail({ from: this.fromAddress, to, subject, html });
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}: ${(error as Error).message}`);
    }
  }

  async sendApplicationConfirmationToCandidate(
    candidateEmail: string,
    candidateName: string,
    jobTitle: string,
  ): Promise<void> {
    const html = `
      <h2>Application Received!</h2>
      <p>Hi ${candidateName},</p>
      <p>We've received your application for <strong>${jobTitle}</strong> at MetaUpSpace.</p>
      <p>Our team will review your profile and get back to you if it aligns with our requirements.</p>
      <p>Thank you for considering MetaUpSpace for the next step in your journey!</p>
      <br><p>Team MetaUpSpace</p>
    `;
    await this.send(candidateEmail, `Application Received — ${jobTitle}`, html);
  }

  async sendNewApplicationAlertToAdmin(
    adminEmail: string,
    candidateName: string,
    candidateEmail: string,
    jobTitle: string,
  ): Promise<void> {
    const html = `
      <h2>New Application Received</h2>
      <p>A new application has been submitted for <strong>${jobTitle}</strong>.</p>
      <p><strong>Candidate:</strong> ${candidateName}</p>
      <p><strong>Email:</strong> ${candidateEmail}</p>
      <p>Log in to the admin panel to review the application.</p>
    `;
    await this.send(adminEmail, `New Application — ${jobTitle} from ${candidateName}`, html);
  }

  async sendStatusUpdate(
    candidateEmail: string,
    candidateName: string,
    jobTitle: string,
    status: ApplicationStatus,
  ): Promise<void> {
    const templates: Partial<Record<ApplicationStatus, { subject: string; html: string }>> = {
      [ApplicationStatus.REVIEWED]: {
        subject: 'Your Application is Under Review',
        html: `<h2>Application Update</h2><p>Hi ${candidateName},</p><p>Your application for <strong>${jobTitle}</strong> is currently under review. We'll update you soon.</p><p>Team MetaUpSpace</p>`,
      },
      [ApplicationStatus.SHORTLISTED]: {
        subject: `You've Been Shortlisted — ${jobTitle}`,
        html: `<h2>Great News!</h2><p>Hi ${candidateName},</p><p>You've been shortlisted for <strong>${jobTitle}</strong> at MetaUpSpace! Our team will be in touch with the next steps shortly.</p><p>Team MetaUpSpace</p>`,
      },
      [ApplicationStatus.REJECTED]: {
        subject: 'Application Update — MetaUpSpace',
        html: `<h2>Application Update</h2><p>Hi ${candidateName},</p><p>Thank you for applying for <strong>${jobTitle}</strong>. After careful consideration, we've decided to move forward with other candidates at this time. We appreciate your interest and encourage you to apply for future openings.</p><p>Team MetaUpSpace</p>`,
      },
      [ApplicationStatus.HIRED]: {
        subject: `Congratulations — Next Steps for ${jobTitle}`,
        html: `<h2>Congratulations!</h2><p>Hi ${candidateName},</p><p>We're thrilled to inform you that you've been selected for <strong>${jobTitle}</strong> at MetaUpSpace! Our HR team will reach out shortly with the offer details and onboarding next steps.</p><p>Team MetaUpSpace</p>`,
      },
    };

    const template = templates[status];
    if (!template) return;
    await this.send(candidateEmail, template.subject, template.html);
  }
}
```

- [ ] **Step 2: Create mail module**

```typescript
// src/mail/mail.module.ts
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';

@Module({
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
```

- [ ] **Step 3: Commit**

```bash
git add src/mail/
git commit -m "feat: add mail module with Nodemailer Gmail templates"
```

---

### Task 10: Applications Schema & DTOs

**Files:**
- Create: `src/applications/schemas/application.schema.ts`
- Create: `src/applications/dto/create-application.dto.ts`
- Create: `src/applications/dto/update-status.dto.ts`
- Create: `src/applications/dto/query-applications.dto.ts`

- [ ] **Step 1: Create application schema**

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
  @Prop({ type: Types.ObjectId, ref: 'Job', required: true })
  jobId: Types.ObjectId;

  @Prop({ required: true }) fullName: string;
  @Prop({ required: true }) email: string;
  @Prop({ required: true }) contactNumber: string;
  @Prop({ required: true }) whatsappNumber: string;
  @Prop({ required: true }) currentLocation: string;
  @Prop({ required: true }) linkedinId: string;
  @Prop({ required: true }) qualification: string;

  @Prop({ required: true, enum: Object.values(Experience) })
  experience: Experience;

  @Prop({ required: true }) comfortableFlexibleShifts: boolean;
  @Prop({ required: true }) lastSalary: string;
  @Prop({ required: true }) noticePeriod: string;
  @Prop() referredBy?: string;

  @Prop({ required: true, enum: Object.values(HearAboutUs) })
  hearAboutUs: HearAboutUs;

  @Prop({ required: true }) resumeUrl: string;
  @Prop({ required: true }) whyGoodFit: string;
  @Prop({ required: true }) whyJoinUs: string;

  // Tech-only standard fields
  @Prop() githubId?: string;
  @Prop() portfolioLink?: string;
  @Prop() technologiesKnown?: string;
  @Prop() hardestProblem?: string;

  @Prop({ type: Object, default: {} })
  customResponses: Record<string, unknown>;

  @Prop({
    required: true,
    enum: Object.values(ApplicationStatus),
    default: ApplicationStatus.PENDING,
  })
  status: ApplicationStatus;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);
```

- [ ] **Step 2: Create create-application DTO**

```typescript
// src/applications/dto/create-application.dto.ts
import {
  IsString,
  IsEmail,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsObject,
} from 'class-validator';
import { Experience } from '../../common/enums/experience.enum';
import { HearAboutUs } from '../../common/enums/hear-about-us.enum';

export class CreateApplicationDto {
  @IsString() fullName: string;
  @IsEmail() email: string;
  @IsString() contactNumber: string;
  @IsString() whatsappNumber: string;
  @IsString() currentLocation: string;
  @IsString() linkedinId: string;
  @IsString() qualification: string;
  @IsEnum(Experience) experience: Experience;
  @IsBoolean() comfortableFlexibleShifts: boolean;
  @IsString() lastSalary: string;
  @IsString() noticePeriod: string;
  @IsOptional() @IsString() referredBy?: string;
  @IsEnum(HearAboutUs) hearAboutUs: HearAboutUs;
  @IsString() resumeUrl: string;
  @IsString() whyGoodFit: string;
  @IsString() whyJoinUs: string;

  // Tech-only fields — conditionally required at service layer
  @IsOptional() @IsString() githubId?: string;
  @IsOptional() @IsString() portfolioLink?: string;
  @IsOptional() @IsString() technologiesKnown?: string;
  @IsOptional() @IsString() hardestProblem?: string;

  @IsOptional() @IsObject() customResponses?: Record<string, unknown>;
}
```

- [ ] **Step 3: Create update-status DTO**

```typescript
// src/applications/dto/update-status.dto.ts
import { IsEnum } from 'class-validator';
import { ApplicationStatus } from '../../common/enums/application-status.enum';

export class UpdateStatusDto {
  @IsEnum(ApplicationStatus)
  status: ApplicationStatus;
}
```

- [ ] **Step 4: Create query-applications DTO**

```typescript
// src/applications/dto/query-applications.dto.ts
import { IsOptional, IsString, IsEnum, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApplicationStatus } from '../../common/enums/application-status.enum';

export class QueryApplicationsDto {
  @IsOptional() @IsString() jobId?: string;
  @IsOptional() @IsEnum(ApplicationStatus) status?: ApplicationStatus;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) limit?: number;
}
```

- [ ] **Step 5: Commit**

```bash
git add src/applications/schemas/ src/applications/dto/
git commit -m "feat: add applications schema and DTOs"
```

---

### Task 11: Applications Service (TDD)

**Files:**
- Create: `src/applications/applications.service.spec.ts`
- Create: `src/applications/applications.service.ts`

- [ ] **Step 1: Write failing applications service tests**

```typescript
// src/applications/applications.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { Application } from './schemas/application.schema';
import { JobsService } from '../jobs/jobs.service';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { JobType } from '../common/enums/job-type.enum';
import { ApplicationStatus } from '../common/enums/application-status.enum';
import { Experience } from '../common/enums/experience.enum';
import { HearAboutUs } from '../common/enums/hear-about-us.enum';

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
    { fieldId: 'region', label: 'Preferred Region', fieldType: 'text', required: true, options: [] },
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

const mockApplication = { _id: 'app-id-1', ...techDto, jobId: 'job-id-1', status: ApplicationStatus.PENDING };

const mockApplicationModel = {
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  countDocuments: jest.fn(),
};

const mockJobsService = { findOne: jest.fn() };
const mockMailService = {
  sendApplicationConfirmationToCandidate: jest.fn().mockResolvedValue(undefined),
  sendNewApplicationAlertToAdmin: jest.fn().mockResolvedValue(undefined),
  sendStatusUpdate: jest.fn().mockResolvedValue(undefined),
};
const mockConfigService = { get: jest.fn().mockReturnValue('admin@metaupspace.com') };

describe('ApplicationsService', () => {
  let service: ApplicationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationsService,
        { provide: getModelToken(Application.name), useValue: mockApplicationModel },
        { provide: JobsService, useValue: mockJobsService },
        { provide: MailService, useValue: mockMailService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<ApplicationsService>(ApplicationsService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('creates application for active tech job with all tech fields', async () => {
      mockJobsService.findOne.mockResolvedValue(mockTechJob);
      mockApplicationModel.create.mockResolvedValue(mockApplication);
      const result = await service.create('job-id-1', techDto);
      expect(mockApplicationModel.create).toHaveBeenCalledWith(
        expect.objectContaining({ jobId: 'job-id-1', status: ApplicationStatus.PENDING }),
      );
      expect(result).toEqual(mockApplication);
    });

    it('throws BadRequestException when job is inactive', async () => {
      mockJobsService.findOne.mockResolvedValue({ ...mockTechJob, isActive: false });
      await expect(service.create('job-id-1', techDto)).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException when tech fields missing for tech job', async () => {
      mockJobsService.findOne.mockResolvedValue(mockTechJob);
      const dto = { ...baseDto }; // no githubId, portfolioLink, etc.
      await expect(service.create('job-id-1', dto)).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException when required custom field missing', async () => {
      mockJobsService.findOne.mockResolvedValue(mockNonTechJob);
      mockApplicationModel.create.mockResolvedValue(mockApplication);
      // no customResponses.region provided
      await expect(service.create('job-id-2', baseDto)).rejects.toThrow(BadRequestException);
    });

    it('creates non-tech application with required custom field provided', async () => {
      mockJobsService.findOne.mockResolvedValue(mockNonTechJob);
      mockApplicationModel.create.mockResolvedValue(mockApplication);
      const dto = { ...baseDto, customResponses: { region: 'West India' } };
      await service.create('job-id-2', dto);
      expect(mockApplicationModel.create).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('returns application when found', async () => {
      mockApplicationModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(mockApplication) }),
      });
      const result = await service.findOne('app-id-1');
      expect(result).toEqual(mockApplication);
    });

    it('throws NotFoundException when application does not exist', async () => {
      mockApplicationModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(null) }),
      });
      await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStatus', () => {
    it('updates status and triggers email notification', async () => {
      const updated = { ...mockApplication, status: ApplicationStatus.SHORTLISTED, jobId: { title: 'Backend Developer' } };
      mockApplicationModel.findByIdAndUpdate.mockReturnValue({
        populate: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(updated) }),
      });
      const result = await service.updateStatus('app-id-1', { status: ApplicationStatus.SHORTLISTED });
      expect(result.status).toBe(ApplicationStatus.SHORTLISTED);
      // email is fire-and-forget; just verify no throw
    });

    it('throws NotFoundException when application does not exist', async () => {
      mockApplicationModel.findByIdAndUpdate.mockReturnValue({
        populate: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(null) }),
      });
      await expect(
        service.updateStatus('nonexistent', { status: ApplicationStatus.REVIEWED }),
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
      await expect(service.remove('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });
});
```

- [ ] **Step 2: Run test — expect failure**

```bash
npx jest src/applications/applications.service.spec.ts --no-coverage
```
Expected: FAIL — `Cannot find module './applications.service'`

- [ ] **Step 3: Implement applications service**

```typescript
// src/applications/applications.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Application, ApplicationDocument } from './schemas/application.schema';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { QueryApplicationsDto } from './dto/query-applications.dto';
import { JobsService } from '../jobs/jobs.service';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { JobType } from '../common/enums/job-type.enum';
import { ApplicationStatus } from '../common/enums/application-status.enum';

@Injectable()
export class ApplicationsService {
  private readonly logger = new Logger(ApplicationsService.name);

  constructor(
    @InjectModel(Application.name)
    private applicationModel: Model<ApplicationDocument>,
    private readonly jobsService: JobsService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

  async create(jobId: string, dto: CreateApplicationDto): Promise<ApplicationDocument> {
    const job = await this.jobsService.findOne(jobId);

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
      .filter(
        (f) =>
          f.required &&
          (!dto.customResponses || dto.customResponses[f.fieldId] === undefined),
      )
      .map((f) => f.label);

    if (missingCustom.length) {
      throw new BadRequestException(`Missing required fields: ${missingCustom.join(', ')}`);
    }

    const application = await this.applicationModel.create({
      ...dto,
      jobId,
      status: ApplicationStatus.PENDING,
    });

    this.mailService
      .sendApplicationConfirmationToCandidate(dto.email, dto.fullName, job.title)
      .catch((err) => this.logger.error('Candidate confirmation email failed', err));

    this.mailService
      .sendNewApplicationAlertToAdmin(
        this.configService.get<string>('admin.email'),
        dto.fullName,
        dto.email,
        job.title,
      )
      .catch((err) => this.logger.error('Admin alert email failed', err));

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
    if (query.jobId) filter.jobId = query.jobId;
    if (query.status) filter.status = query.status;

    const [data, total] = await Promise.all([
      this.applicationModel
        .find(filter)
        .skip((page - 1) * limit)
        .limit(limit)
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
    if (!application) throw new NotFoundException(`Application ${id} not found`);
    return application;
  }

  async updateStatus(id: string, dto: UpdateStatusDto): Promise<ApplicationDocument> {
    const application = await this.applicationModel
      .findByIdAndUpdate(id, { status: dto.status }, { new: true })
      .populate('jobId', 'title')
      .exec();
    if (!application) throw new NotFoundException(`Application ${id} not found`);

    if (dto.status !== ApplicationStatus.PENDING) {
      const jobTitle = (application.jobId as unknown as { title: string })?.title ?? 'the position';
      this.mailService
        .sendStatusUpdate(application.email, application.fullName, jobTitle, dto.status)
        .catch((err) => this.logger.error('Status update email failed', err));
    }

    return application;
  }

  async remove(id: string): Promise<void> {
    const result = await this.applicationModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Application ${id} not found`);
  }
}
```

- [ ] **Step 4: Run tests — expect all pass**

```bash
npx jest src/applications/applications.service.spec.ts --no-coverage
```
Expected: PASS — 9 tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/applications/applications.service.ts src/applications/applications.service.spec.ts
git commit -m "feat: add applications service with TDD"
```

---

### Task 12: Applications Controllers & Module

**Files:**
- Create: `src/applications/applications.controller.ts`
- Create: `src/applications/admin-applications.controller.ts`
- Create: `src/applications/applications.module.ts`

- [ ] **Step 1: Create public applications controller**

```typescript
// src/applications/applications.controller.ts
import { Controller, Post, Param, Body } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post(':jobId')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  create(@Param('jobId') jobId: string, @Body() dto: CreateApplicationDto) {
    return this.applicationsService.create(jobId, dto);
  }
}
```

- [ ] **Step 2: Create admin applications controller**

```typescript
// src/applications/admin-applications.controller.ts
import { Controller, Get, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { AdminOnly } from '../common/decorators/admin-only.decorator';
import { ApplicationsService } from './applications.service';
import { UpdateStatusDto } from './dto/update-status.dto';
import { QueryApplicationsDto } from './dto/query-applications.dto';

@Controller('admin/applications')
export class AdminApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get()
  @AdminOnly()
  findAll(@Query() query: QueryApplicationsDto) {
    return this.applicationsService.findAll(query);
  }

  @Get(':id')
  @AdminOnly()
  findOne(@Param('id') id: string) {
    return this.applicationsService.findOne(id);
  }

  @Patch(':id/status')
  @AdminOnly()
  updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.applicationsService.updateStatus(id, dto);
  }

  @Delete(':id')
  @AdminOnly()
  remove(@Param('id') id: string) {
    return this.applicationsService.remove(id);
  }
}
```

- [ ] **Step 3: Create applications module**

```typescript
// src/applications/applications.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Application, ApplicationSchema } from './schemas/application.schema';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { AdminApplicationsController } from './admin-applications.controller';
import { JobsModule } from '../jobs/jobs.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Application.name, schema: ApplicationSchema }]),
    JobsModule,
    MailModule,
  ],
  controllers: [ApplicationsController, AdminApplicationsController],
  providers: [ApplicationsService],
})
export class ApplicationsModule {}
```

- [ ] **Step 4: Commit**

```bash
git add src/applications/applications.controller.ts src/applications/admin-applications.controller.ts src/applications/applications.module.ts
git commit -m "feat: add applications controllers and module"
```

---

### Task 13: App Module & main.ts Bootstrap

**Files:**
- Modify: `src/app.module.ts`
- Modify: `src/main.ts`

- [ ] **Step 1: Write app module**

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import configuration from './config/configuration';
import { AuthModule } from './auth/auth.module';
import { JobsModule } from './jobs/jobs.module';
import { ApplicationsModule } from './applications/applications.module';
import { UploadModule } from './upload/upload.module';
import { MailModule } from './mail/mail.module';

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
    AuthModule,
    JobsModule,
    ApplicationsModule,
    UploadModule,
    MailModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
```

- [ ] **Step 2: Write main.ts**

```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(helmet());
  app.enableCors({ origin: configService.get<string>('cors.origin') });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new GlobalExceptionFilter());

  const port = configService.get<number>('port') ?? 3000;
  await app.listen(port);
}

bootstrap();
```

- [ ] **Step 3: Run full test suite**

```bash
npx jest --no-coverage
```
Expected: All tests pass (auth.service.spec, jobs.service.spec, applications.service.spec).

- [ ] **Step 4: Build to confirm no TypeScript errors**

```bash
npx nest build
```
Expected: `dist/` created, zero errors.

- [ ] **Step 5: Commit**

```bash
git add src/app.module.ts src/main.ts
git commit -m "feat: wire app module and bootstrap with helmet, CORS, throttler"
```

---

### Task 14: Manual Smoke Test

Prerequisites: MongoDB running, `.env` file with all required variables set.

- [ ] **Step 1: Start the server**

```bash
npm run start:dev
```
Expected: `[NestApplication] Nest application successfully started` on port 3000.

- [ ] **Step 2: Login as admin**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"<ADMIN_EMAIL>","password":"<ADMIN_PASSWORD>"}'
```
Expected: `{"access_token":"eyJ..."}`

Save the token: `TOKEN=<access_token from response>`

- [ ] **Step 3: Create a tech job**

```bash
curl -X POST http://localhost:3000/api/admin/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Backend Developer",
    "description": "Build scalable APIs for global clients.",
    "domain": "Backend",
    "type": "tech",
    "requirements": ["Node.js", "MongoDB"],
    "customFields": [
      {
        "fieldId": "preferredStack",
        "label": "Preferred Tech Stack",
        "fieldType": "text",
        "required": true
      }
    ]
  }'
```
Expected: `201` with job document including `_id` and `slug`.

Save job ID: `JOB_ID=<_id from response>`

- [ ] **Step 4: List active jobs (public)**

```bash
curl http://localhost:3000/api/jobs
```
Expected: `200` array containing the job created above.

- [ ] **Step 5: Upload a resume**

```bash
curl -X POST http://localhost:3000/api/upload/resume \
  -F "file=@/path/to/test-resume.pdf"
```
Expected: `201` with `{"url":"https://res.cloudinary.com/..."}`

Save URL: `RESUME_URL=<url from response>`

- [ ] **Step 6: Submit a tech application**

```bash
curl -X POST "http://localhost:3000/api/applications/$JOB_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test Candidate",
    "email": "candidate@example.com",
    "contactNumber": "9876543210",
    "whatsappNumber": "9876543210",
    "currentLocation": "Mumbai",
    "linkedinId": "linkedin.com/in/test",
    "qualification": "B.Tech",
    "experience": "fresher",
    "comfortableFlexibleShifts": true,
    "lastSalary": "0",
    "noticePeriod": "Immediate",
    "hearAboutUs": "linkedin_post",
    "resumeUrl": "<RESUME_URL>",
    "whyGoodFit": "Passionate about backend.",
    "whyJoinUs": "Amazing company.",
    "githubId": "github.com/test",
    "portfolioLink": "https://test.dev",
    "technologiesKnown": "Node.js, MongoDB",
    "hardestProblem": "Optimized a slow query.",
    "customResponses": { "preferredStack": "NestJS + MongoDB" }
  }'
```
Expected: `201` with application document, `status: "pending"`.

Save application ID: `APP_ID=<_id from response>`

- [ ] **Step 7: List applications as admin**

```bash
curl "http://localhost:3000/api/admin/applications?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```
Expected: `200` with `{ data: [...], total: 1, page: 1, limit: 10 }`.

- [ ] **Step 8: Update application status**

```bash
curl -X PATCH "http://localhost:3000/api/admin/applications/$APP_ID/status" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"status": "shortlisted"}'
```
Expected: `200` with updated application. Candidate email received.

- [ ] **Step 9: Verify 401 on missing token**

```bash
curl -X POST http://localhost:3000/api/admin/jobs \
  -H "Content-Type: application/json" \
  -d '{"title":"Hacked","description":"x","domain":"x","type":"tech"}'
```
Expected: `401 Unauthorized`.

- [ ] **Step 10: Commit**

```bash
git add .
git commit -m "chore: complete job portal backend implementation"
```
