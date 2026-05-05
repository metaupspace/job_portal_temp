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
  @Prop({ type: String, default: null }) otpHash!: string | null;
  @Prop({ type: Date, default: null }) otpExpiresAt!: Date | null;

  // TOTP — factor 2
  @Prop({ type: String, default: null }) totpSecret!: string | null;
  @Prop({ type: String, default: null }) pendingTotpSecret!: string | null;
  @Prop({ default: false }) totpEnabled!: boolean;
  @Prop({ type: [String], default: [] }) backupCodes!: string[];
  @Prop({ default: false }) mfaEnrolled!: boolean;
}

export const ApplicantSchema = SchemaFactory.createForClass(Applicant);
ApplicantSchema.index({ email: 1 }, { unique: true });
