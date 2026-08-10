import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateSettingsDto {
  @ApiPropertyOptional() @IsOptional() @IsString() siteName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() signature?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() sloganEs?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() sloganEn?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() logoUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() faviconUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() email?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() phone?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() whatsappNumber?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() whatsappMessageEs?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() whatsappMessageEn?: string;
  @ApiPropertyOptional() @IsOptional() @IsUrl() instagramUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsUrl() youtubeUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsUrl() spotifyUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() addressEs?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() addressEn?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() openingHoursEs?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() openingHoursEn?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() mapEmbedUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() seoTitleEs?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() seoTitleEn?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() seoDescriptionEs?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() seoDescriptionEn?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() ogImageUrl?: string;
}
