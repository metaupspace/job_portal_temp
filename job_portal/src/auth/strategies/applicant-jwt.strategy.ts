import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

export interface JwtApplicantUser {
  userId: string;
  email: string;
  role: string;
}

@Injectable()
export class ApplicantJwtStrategy extends PassportStrategy(Strategy, 'jwt-applicant') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('jwt.secret'),
    });
  }

  validate(payload: { sub: string; email: string; role: string }): JwtApplicantUser {
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
