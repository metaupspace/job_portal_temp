import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { JobType } from '../../common/enums/job-type.enum';
import { FieldType } from '../../common/enums/field-type.enum';

export type JobDocument = Job & Document;

@Schema({ _id: false })
export class FieldDefinition {
  @Prop({ required: true }) fieldId: string;
  @Prop({ required: true }) label: string;
  @Prop({ required: true, enum: Object.values(FieldType) })
  fieldType: FieldType;
  @Prop({ default: false }) required: boolean;
  @Prop({ type: [String], default: [] }) options: string[];
}

export const FieldDefinitionSchema =
  SchemaFactory.createForClass(FieldDefinition);

@Schema({ timestamps: true })
export class Job {
  @Prop({ required: true }) title: string;
  @Prop({ required: true, unique: true }) slug: string;
  @Prop({ required: true }) description: string;
  @Prop({ required: true }) domain: string;
  @Prop({ required: true, enum: Object.values(JobType) }) type: JobType;
  @Prop({ default: true }) isActive: boolean;
  @Prop({ type: [String], default: [] }) requirements: string[];
  @Prop({ type: [FieldDefinitionSchema], default: [] })
  customFields: FieldDefinition[];
}

export const JobSchema = SchemaFactory.createForClass(Job);
