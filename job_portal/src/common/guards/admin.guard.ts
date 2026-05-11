import {
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { JwtUser } from '../../auth/strategies/jwt.strategy';

@Injectable()
export class AdminGuard extends AuthGuard('jwt') {
  handleRequest<TUser = JwtUser>(
    err: Error | null,
    user: JwtUser | false,
  ): TUser {
    if (err || !user) throw err ?? new UnauthorizedException();

    const normalizedRoles = new Set(
      [user.role, ...(user.roles ?? [])]
        .filter(Boolean)
        .map((role) => String(role).toUpperCase()),
    );

    if (!normalizedRoles.has('ADMIN') && !normalizedRoles.has('HR')) {
      throw new ForbiddenException('Admin access required');
    }

    return user as unknown as TUser;
  }
}
