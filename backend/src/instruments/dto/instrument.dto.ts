import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { InstrumentStatus } from '@prisma/client';

export class InstrumentImageDto {
  @ApiProperty() @IsString() imageUrl!: string;
  @ApiProperty() @IsString() altEs!: string;
  @ApiProperty() @IsString() altEn!: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() displayOrder?: number;
}

export class CreateInstrumentDto {
  @ApiProperty() @IsString() slug!: string;
  @ApiProperty() @IsString() nameEs!: string;
  @ApiProperty() @IsString() nameEn!: string;
  @ApiProperty() @IsString() descriptionEs!: string;
  @ApiProperty() @IsString() descriptionEn!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() materialsEs?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() materialsEn?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() specificationsEs?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() specificationsEn?: string;
  @ApiPropertyOptional({ enum: InstrumentStatus })
  @IsOptional()
  @IsEnum(InstrumentStatus)
  status?: InstrumentStatus;
  @ApiPropertyOptional() @IsOptional() @IsNumber() price?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() currency?: string;
  @ApiProperty() @IsString() mainImageUrl!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() youtubeUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() whatsappMessageEs?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() whatsappMessageEn?: string;
  @ApiProperty() @IsUUID() categoryId!: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isFeatured?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isPublished?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsInt() displayOrder?: number;
  @ApiPropertyOptional({ type: [InstrumentImageDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InstrumentImageDto)
  images?: InstrumentImageDto[];
}

export class UpdateInstrumentDto extends PartialType(CreateInstrumentDto) {}
