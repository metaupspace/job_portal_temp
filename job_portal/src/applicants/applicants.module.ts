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
