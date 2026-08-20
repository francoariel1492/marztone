import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsInt, IsOptional, IsString } from 'class-validator';
import { SECTION_LAYOUTS } from './update-section.dto';

export class CreateSectionDto {
  @ApiPropertyOptional() @IsOptional() @IsString() key?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() label?: string;
  @ApiPropertyOptional({ enum: SECTION_LAYOUTS })
  @IsOptional()
  @IsIn(SECTION_LAYOUTS)
  layout?: string;
  @ApiPropertyOptional() @IsString() titleEs!: string;
  @ApiPropertyOptional() @IsString() titleEn!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() subtitleEs?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() subtitleEn?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() contentEs?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() contentEn?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() imageUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isVisible?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsInt() displayOrder?: number;
}
