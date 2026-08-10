import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty() @IsString() slug!: string;
  @ApiProperty() @IsString() titleEs!: string;
  @ApiProperty() @IsString() titleEn!: string;
  @ApiProperty() @IsString() descriptionEs!: string;
  @ApiProperty() @IsString() descriptionEn!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() icon?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() imageUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() whatsappMessageEs?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() whatsappMessageEn?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isActive?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsInt() displayOrder?: number;
}

export class UpdateServiceDto extends PartialType(CreateServiceDto) {}
