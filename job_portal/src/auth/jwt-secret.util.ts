import { ConfigService } from '@nestjs/config';

export const getJwtSecret = (configService: ConfigService): string => {
  const secret =
    configService.get<string>('jwt.secret') ??
    configService.get<string>('JWT_SECRET') ??
    process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is required');
  }

  return secret;
};
