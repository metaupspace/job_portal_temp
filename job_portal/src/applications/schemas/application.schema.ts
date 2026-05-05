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
