import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApplicantGuard } from '../guards/applicant.guard';
export const ApplicantOnly = () => applyDecorators(UseGuards(ApplicantGuard));
