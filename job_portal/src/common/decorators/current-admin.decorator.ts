import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface JwtAdminUser {
  userId: string;
  email: string;
  role: string;
}

export const CurrentAdmin = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtAdminUser => {
    const request = ctx.switchToHttp().getRequest<{ user: JwtAdminUser }>();
    return request.user;
  },
);
