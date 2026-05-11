import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface JwtAdminUser {
  userId: string;
  employeeId: string | null;
  email?: string;
  role: string;
  roles: string[];
}

export const CurrentAdmin = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtAdminUser => {
    const request = ctx.switchToHttp().getRequest<{ user: JwtAdminUser }>();
    return request.user;
  },
);
