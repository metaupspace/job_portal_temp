import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyTotpDto {
  @ApiProperty({ example: '482910', description: '6-digit TOTP code or XXXX-XXXX-XXXX-XXXX backup code' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(19)
  code: string;
}
