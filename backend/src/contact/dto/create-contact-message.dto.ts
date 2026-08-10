import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Language } from '@prisma/client';

export class CreateContactMessageDto {
  @ApiProperty() @IsString() @IsNotEmpty() @MaxLength(120) name!: string;
  @ApiProperty() @IsEmail() @MaxLength(180) email!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(40) phone?: string;
  @ApiProperty() @IsString() @IsNotEmpty() @MaxLength(60) inquiryType!: string;
  @ApiProperty() @IsString() @IsNotEmpty() @MaxLength(160) subject!: string;
  @ApiProperty() @IsString() @MinLength(10) @MaxLength(4000) message!: string;
  @ApiPropertyOptional({ enum: Language }) @IsOptional() @IsEnum(Language) language?: Language;

  // Honeypot invisible: si viene con valor, es spam.
  @ApiPropertyOptional() @IsOptional() @IsString() website?: string;

  @ApiProperty({ description: 'Consentimiento del usuario' })
  @IsNotEmpty()
  consent!: boolean;
}
