import { Injectable, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtApplicantUser } from '../../auth/strategies/applicant-jwt.strategy';

@Injectable()
export class ApplicantSessionGuard extends AuthGuard('jwt-applicant') {
  handleRequest<TUser = JwtApplicantUser>(err: Error | null, user: JwtApplicantUser | false): TUser {
    if (err || !user) throw err ?? new UnauthorizedException();
    if (user.role !== 'applicant-session') throw new ForbiddenException('Session token required');
    return user as unknown as TUser;
  }
}
