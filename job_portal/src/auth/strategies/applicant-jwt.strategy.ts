import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

export interface JwtApplicantUser {
  userId: string;
  email: string;
  role: string;
}

@Injectable()
export class ApplicantJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt-applicant',
) {
  constructor(configService: ConfigService, jwtService: JwtService) {
    const secret = configService.getOrThrow<string>('jwt.secret');
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

  validate(payload: Record<string, unknown>): JwtApplicantUser {
    const userId = (payload.sub ?? payload.id ?? payload.userId) as string;
    const role = (
      Array.isArray(payload.roles)
        ? payload.roles[0]
        : (payload.role ?? payload.roles)
    ) as string;
    return { userId, email: payload.email as string, role };
  }
}
