import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  HttpCode,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ApplicantsService } from './applicants.service';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { VerifyTotpDto } from './dto/verify-totp.dto';
import { UpdateApplicantDto } from './dto/update-applicant.dto';
import { ApplicantOnly } from '../common/decorators/applicant-only.decorator';
import { SetupTokenOnly } from '../common/decorators/setup-token-only.decorator';
import { SessionTokenOnly } from '../common/decorators/session-token-only.decorator';
import { CurrentApplicant } from '../common/decorators/current-applicant.decorator';
import { JwtApplicantUser } from '../auth/strategies/applicant-jwt.strategy';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';
import { ResponseMessage } from '../common/decorators/response-message.decorator';

@ApiTags('Applicants')
@Controller('applicants')
export class ApplicantsController {
  constructor(private readonly applicantsService: ApplicantsService) {}

  // ── Auth ────────────────────────────────────────────────────────────────────

  @Post('request-otp')
  @HttpCode(200)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ResponseMessage('If that email is registered, an OTP has been sent')
  @ApiOperation({ summary: 'Request email OTP (factor 1)' })
  @ApiResponse({ status: 200 })
  requestOtp(@Body() dto: RequestOtpDto) {
    return this.applicantsService.requestOtp(dto.email);
  }

  @Post('verify-otp')
  @HttpCode(200)
  @Throttle({ default: { limit: 5, ttl: 900000 } })
  @ResponseMessage('OTP verified')
  @ApiOperation({ summary: 'Verify email OTP — returns setupToken or sessionToken' })
  @ApiResponse({ status: 200 })
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.applicantsService.verifyOtp(dto.email, dto.otp);
  }

  @Post('setup-totp')
  @HttpCode(200)
  @SetupTokenOnly()
  @ResponseMessage('TOTP setup initiated')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate TOTP secret + QR code (requires setupToken)' })
  @ApiResponse({ status: 200, description: '{ qrCodeUri, qrCodeDataUrl, secret }' })
  setupTotp(@CurrentApplicant() user: JwtApplicantUser) {
    return this.applicantsService.setupTotp(user.userId);
  }

  @Post('confirm-totp')
  @HttpCode(200)
  @SetupTokenOnly()
  @ResponseMessage('TOTP enrolled. Save your backup codes — they will not be shown again.')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Confirm TOTP enrollment (requires setupToken + TOTP code)' })
  @ApiResponse({ status: 200, description: '{ accessToken, backupCodes }' })
  confirmTotp(
    @CurrentApplicant() user: JwtApplicantUser,
    @Body() dto: VerifyTotpDto,
  ) {
    return this.applicantsService.confirmTotp(user.userId, dto.code);
  }

  @Post('verify-totp')
  @HttpCode(200)
  @SessionTokenOnly()
  @ResponseMessage('Authentication successful')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify TOTP code or backup code (requires sessionToken)' })
  @ApiResponse({ status: 200, description: '{ accessToken }' })
  verifyTotp(
    @CurrentApplicant() user: JwtApplicantUser,
    @Body() dto: VerifyTotpDto,
  ) {
    return this.applicantsService.verifyTotp(user.userId, dto.code);
  }

  // ── Dashboard ────────────────────────────────────────────────────────────────

  @Get('me')
  @ApplicantOnly()
  @ResponseMessage('Profile fetched')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get own profile' })
  getProfile(@CurrentApplicant() user: JwtApplicantUser) {
    return this.applicantsService.getProfile(user.userId);
  }

  @Patch('me')
  @ApplicantOnly()
  @ResponseMessage('Profile updated')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update own profile (email not patchable)' })
  updateProfile(
    @CurrentApplicant() user: JwtApplicantUser,
    @Body() dto: UpdateApplicantDto,
  ) {
    return this.applicantsService.updateProfile(user.userId, dto);
  }

  @Get('me/applications')
  @ApplicantOnly()
  @ResponseMessage('Applications fetched')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all own applications with status' })
  getMyApplications(@CurrentApplicant() user: JwtApplicantUser) {
    return this.applicantsService.getMyApplications(user.userId, user.email);
  }

  @Post('me/applications/:id/withdraw')
  @HttpCode(200)
  @ApplicantOnly()
  @ResponseMessage('Application withdrawn')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Withdraw a pending/reviewed application' })
  @ApiResponse({ status: 409, description: 'Cannot withdraw SHORTLISTED/HIRED/REJECTED application' })
  withdraw(
    @CurrentApplicant() user: JwtApplicantUser,
    @Param('id', ParseMongoIdPipe) id: string,
  ) {
    return this.applicantsService.withdraw(id, user.userId);
  }
}
