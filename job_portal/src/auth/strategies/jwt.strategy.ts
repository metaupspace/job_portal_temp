import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

type JwtPayloadValue = string | string[] | number | null | undefined;

interface SupportedJwtPayload {
  id?: string;
  userId?: string;
  sub?: string;
  empId?: string;
  employeeId?: string;
  employeeID?: string;
  email?: string;
  role?: JwtPayloadValue;
  roles?: JwtPayloadValue;
}

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

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const secret = configService.getOrThrow<string>('jwt.secret');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: (_request, rawJwtToken, done) => {
        const token = String(rawJwtToken);

        try {
          jwt.verify(token, secret);
          done(null, secret);
        } catch (rawError) {
          try {
            const base64Secret = Buffer.from(secret, 'base64');
            jwt.verify(token, base64Secret);
            done(null, base64Secret);
          } catch {
            done(rawError as Error);
          }
        }
      },
    });
  }

  validate(payload: SupportedJwtPayload): JwtUser {
    const roles = [
      ...normalizeRoles(payload.roles),
      ...normalizeRoles(payload.role),
    ];
    const uniqueRoles = [...new Set(roles)];

    return {
      userId: payload.id || payload.userId || payload.sub || '',
      employeeId:
        payload.empId || payload.employeeId || payload.employeeID || null,
      email: payload.email,
      role: uniqueRoles[0] || '',
      roles: uniqueRoles,
    };
  }
}
