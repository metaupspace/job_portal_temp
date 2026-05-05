import {
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

interface JwtUser {
  userId: string;
  email: string;
  role: string;
}

@Injectable()
export class AdminGuard extends AuthGuard('jwt') {
  handleRequest<TUser = JwtUser>(
    err: Error | null,
    user: JwtUser | false,
  ): TUser {
    if (err || !user) throw err ?? new UnauthorizedException();
    if (user.role !== 'admin')
      throw new ForbiddenException('Admin access required');
    return user as unknown as TUser;
  }
}
