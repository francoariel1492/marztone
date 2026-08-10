import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateArtistDto {
  @ApiProperty() @IsString() slug!: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() stageName?: string;
  @ApiProperty() @IsString() biographyEs!: string;
  @ApiProperty() @IsString() biographyEn!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() instrumentUsedEs?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() instrumentUsedEn?: string;
  @ApiProperty() @IsString() imageUrl!: string;
  @ApiPropertyOptional() @IsOptional() @IsUrl() instagramUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsUrl() youtubeUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsUrl() spotifyUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsUrl() websiteUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isFeatured?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isPublished?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsInt() displayOrder?: number;
}

export class UpdateArtistDto extends PartialType(CreateArtistDto) {}
