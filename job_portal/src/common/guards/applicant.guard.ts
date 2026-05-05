import { Injectable, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtApplicantUser } from '../../auth/strategies/applicant-jwt.strategy';

@Injectable()
export class ApplicantGuard extends AuthGuard('jwt-applicant') {
  handleRequest<TUser = JwtApplicantUser>(err: Error | null, user: JwtApplicantUser | false): TUser {
    if (err || !user) throw err ?? new UnauthorizedException();
    if (user.role !== 'applicant') throw new ForbiddenException('Applicant access required');
    return user as unknown as TUser;
  }
}
