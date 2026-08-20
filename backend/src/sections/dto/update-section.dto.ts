import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsInt, IsOptional, IsString } from 'class-validator';

export const SECTION_LAYOUTS = [
  'imagen-derecha',
  'imagen-izquierda',
  'texto-centrado',
  'imagen-fondo',
  'apilado',
  'banda-color',
] as const;

export class UpdateSectionDto {
  @ApiPropertyOptional() @IsOptional() @IsString() label?: string;
  @ApiPropertyOptional({ enum: SECTION_LAYOUTS })
  @IsOptional()
  @IsIn(SECTION_LAYOUTS)
  layout?: string;
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
