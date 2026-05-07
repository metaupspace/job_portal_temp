import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { EmployeeRole } from '../../common/enums/employee-role.enum';

export type AdminDocument = HydratedDocument<Admin>;

@Schema({ timestamps: true, collection: 'employees' })
export class Admin {
  @Prop({ required: true, unique: true, trim: true })
  employeeId!: string;

  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email!: string;

  @Prop({ required: true, trim: true })
  contact!: string;

  @Prop({ type: [String], enum: EmployeeRole, default: [] })
  roles!: EmployeeRole[];

  @Prop()
  position?: string;

  @Prop({ required: true })
  address!: string;

  @Prop({ required: true, type: Date })
  dateOfBirth!: Date;

  @Prop()
  managerId?: string;

  @Prop({ type: [String], required: true })
  departmentId!: string[];

  @Prop({ type: [String], default: [] })
  teamIds!: string[];

  @Prop({ type: [String], default: [] })
  managedEmployeeIds!: string[];

  @Prop({ required: true })
  passwordHash!: string;

  // earnings
  @Prop()
  baseSalary?: string;

  @Prop()
  hra?: string;

  @Prop()
  conveyance?: string;

  @Prop()
  OtherAllowances?: string;

  // deductions
  @Prop()
  providentFund?: string;

  @Prop()
  ESIC?: string;

  @Prop()
  ProfessionalTax?: string;

  @Prop()
  encryptedDataKey?: string;

  @Prop({ default: true })
  active!: boolean;

  @Prop()
  shiftStartTime?: string;

  @Prop({ type: Date })
  DateOfJoining?: Date;

  @Prop()
  profilePic?: string;

  @Prop()
  location?: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
