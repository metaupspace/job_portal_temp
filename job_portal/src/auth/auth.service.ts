import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AdminService } from '../admin/admin.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly adminService: AdminService,
  ) {}

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const admin = await this.adminService.findByEmail(loginDto.email);

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(
      loginDto.password,
      admin.passwordHash,
    );

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: admin._id.toString(),
      email: admin.email,
      role: 'admin',
    };

    return { access_token: this.jwtService.sign(payload) };
  }
}
