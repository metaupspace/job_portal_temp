import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApplicantSessionGuard } from '../guards/applicant-session.guard';
export const SessionTokenOnly = () => applyDecorators(UseGuards(ApplicantSessionGuard));
