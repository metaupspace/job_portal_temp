import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AdminService } from '../admin/admin.service';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

const BCRYPT_ROUNDS = 12;

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

  async changePassword(
    adminId: string,
    dto: ChangePasswordDto,
  ): Promise<void> {
    const admin = await this.adminService.findById(adminId);
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    const currentMatches = await bcrypt.compare(
      dto.currentPassword,
      admin.passwordHash,
    );
    if (!currentMatches) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const sameAsOld = await bcrypt.compare(dto.newPassword, admin.passwordHash);
    if (sameAsOld) {
      throw new BadRequestException(
        'New password must be different from current password',
      );
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, BCRYPT_ROUNDS);
    await this.adminService.updatePassword(adminId, passwordHash);
  }
}
