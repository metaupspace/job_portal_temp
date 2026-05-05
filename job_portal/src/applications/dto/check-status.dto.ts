import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckStatusDto {
  @ApiProperty({ example: 'jane@example.com' })
  @IsEmail()
  email: string;
}
