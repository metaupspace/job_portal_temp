// src/applications/applications.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Application, ApplicationSchema } from './schemas/application.schema';
import { Applicant, ApplicantSchema } from '../applicants/schemas/applicant.schema';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { AdminApplicationsController } from './admin-applications.controller';
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
})
export class ApplicationsModule {}
