import { Injectable, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtApplicantUser } from '../../auth/strategies/applicant-jwt.strategy';

@Injectable()
export class ApplicantSetupGuard extends AuthGuard('jwt-applicant') {
  handleRequest<TUser = JwtApplicantUser>(err: Error | null, user: JwtApplicantUser | false): TUser {
    if (err || !user) throw err ?? new UnauthorizedException();
    if (user.role !== 'applicant-setup') throw new ForbiddenException('Setup token required');
    return user as unknown as TUser;
  }
}
