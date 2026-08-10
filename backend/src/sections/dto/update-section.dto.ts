import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateSectionDto {
  @ApiPropertyOptional() @IsOptional() @IsString() titleEs?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() titleEn?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() subtitleEs?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() subtitleEn?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() contentEs?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() contentEn?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() imageUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isVisible?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsInt() displayOrder?: number;
}
