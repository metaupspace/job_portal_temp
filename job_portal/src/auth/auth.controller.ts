import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { AdminOnly } from '../common/decorators/admin-only.decorator';
import {
  CurrentAdmin,
  JwtAdminUser,
} from '../common/decorators/current-admin.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ResponseMessage('Logged in successfully')
  @ApiOperation({ summary: 'Admin login' })
  @ApiResponse({ status: 200, description: 'Returns JWT access token' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('change-password')
  @HttpCode(200)
  @AdminOnly()
  @ApiBearerAuth()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ResponseMessage('Password changed successfully')
  @ApiOperation({
    summary: 'Change HR / admin password',
    description:
      'Authenticated admin updates their own password. Requires the current password and a new password meeting the strength policy.',
  })
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({
    status: 400,
    description: 'Validation failed or new password matches current',
  })
  @ApiResponse({
    status: 401,
    description: 'Missing/invalid token or current password is incorrect',
  })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async changePassword(
    @CurrentAdmin() admin: JwtAdminUser,
    @Body() dto: ChangePasswordDto,
  ) {
    await this.authService.changePassword(admin.userId, dto);
    return { success: true };
  }
}
