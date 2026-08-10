import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateWorkshopImageDto {
  @ApiPropertyOptional() @IsOptional() @IsString() titleEs?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() titleEn?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() descriptionEs?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() descriptionEn?: string;
  @ApiProperty() @IsString() imageUrl!: string;
  @ApiProperty() @IsString() altEs!: string;
  @ApiProperty() @IsString() altEn!: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() displayOrder?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isPublished?: boolean;
}

export class UpdateWorkshopImageDto extends PartialType(CreateWorkshopImageDto) {}
