import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getJwtSecret } from '../jwt-secret.util';

type JwtPayloadValue = string | string[] | number | null | undefined;

export interface JwtUser {
  userId: string;
  employeeId: string | null;
  email?: string;
  role: string;
  roles: string[];
}

const normalizeRoles = (roles: JwtPayloadValue): string[] => {
  if (Array.isArray(roles)) {
    return roles.map((role) => String(role));
  }

  if (typeof roles === 'string') {
    return [roles];
  }

  return [];
};

const firstString = (...values: unknown[]): string => {
  const value = values.find((entry) => typeof entry === 'string');
  return typeof value === 'string' ? value : '';
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService, jwtService: JwtService) {
    const secret = getJwtSecret(configService);
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: (
        _req: unknown,
        rawJwtToken: string,
        done: (err: Error | null, secret?: string | Buffer) => void,
      ) => {
        try {
          jwtService.verify(rawJwtToken, { secret });
          done(null, secret);
        } catch {
          try {
            const base64Secret = Buffer.from(secret, 'base64');
            jwtService.verify(rawJwtToken, { secret: base64Secret });
            done(null, base64Secret);
          } catch (err) {
            done(err as Error);
          }
        }
      },
    });
  }

  validate(payload: Record<string, unknown>): JwtUser {
    const roles = [
      ...normalizeRoles(payload.roles as JwtPayloadValue),
      ...normalizeRoles(payload.role as JwtPayloadValue),
    ];
    const uniqueRoles = [...new Set(roles)];

    return {
      userId: firstString(payload.sub, payload.id, payload.userId),
      employeeId:
        firstString(payload.empId, payload.employeeId, payload.employeeID) ||
        null,
      email: payload.email as string | undefined,
      role: uniqueRoles[0] ?? '',
      roles: uniqueRoles,
    };
  }
}
