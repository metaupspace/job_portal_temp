import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApplicantSetupGuard } from '../guards/applicant-setup.guard';
export const SetupTokenOnly = () => applyDecorators(UseGuards(ApplicantSetupGuard));
