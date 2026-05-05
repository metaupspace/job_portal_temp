import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtApplicantUser } from '../../auth/strategies/applicant-jwt.strategy';

export const CurrentApplicant = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtApplicantUser => {
    const request = ctx.switchToHttp().getRequest<{ user: JwtApplicantUser }>();
    return request.user;
  },
);
