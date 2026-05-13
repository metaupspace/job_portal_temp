import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export interface JwtUserDetails {
  id: string | undefined;
  userId: string | undefined;
  employeeId: string | null;
  email: string;
  roles: string[];
  iat: number | undefined;
  exp: number | undefined;
}

@Injectable()
export class JwtUtilsService {
  private readonly logger = new Logger(JwtUtilsService.name);
  private readonly secret: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.secret = this.configService.getOrThrow<string>('jwt.secret');
  }

  verifyWithFallback<T extends object>(token: string): T {
    try {
      return this.jwtService.verify<T>(token);
    } catch (rawError) {
      try {
        const base64Secret = Buffer.from(this.secret, 'base64');
        return this.jwtService.verify<T>(token, { secret: base64Secret });
      } catch {
        throw rawError;
      }
    }
  }

  validateJwtToken(token: string): boolean {
    try {
      this.verifyWithFallback(token);
      return true;
    } catch (error) {
      this.logger.warn(`JWT validation failed: ${(error as Error).message}`);
      return false;
    }
  }

  getUserIdFromToken(token: string): string | null {
    try {
      const decoded = this.verifyWithFallback<Record<string, string>>(token);
      return decoded.id ?? decoded.userId ?? decoded.sub ?? null;
    } catch (error) {
      this.logger.warn(`Failed to extract user from token: ${(error as Error).message}`);
      return null;
    }
  }

  decodeJwtToken(token: string): Record<string, unknown> | null {
    try {
      return this.jwtService.decode<Record<string, unknown>>(token);
    } catch (error) {
      this.logger.warn(`Failed to decode token: ${(error as Error).message}`);
      return null;
    }
  }

  extractUserDetails(decoded: Record<string, unknown>): JwtUserDetails {
    return {
      id: (decoded.id ?? decoded.userId ?? decoded.sub) as string | undefined,
      userId: decoded.id as string | undefined,
      employeeId: (decoded.empId ?? decoded.employeeId ?? decoded.employeeID ?? null) as string | null,
      email: decoded.email as string,
      roles: (decoded.roles ?? decoded.role ?? []) as string[],
      iat: decoded.iat as number | undefined,
      exp: decoded.exp as number | undefined,
    };
  }
}
