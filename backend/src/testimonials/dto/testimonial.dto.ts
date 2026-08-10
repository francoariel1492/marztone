import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateTestimonialDto {
  @ApiProperty() @IsString() customerName!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() customerImageUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() relatedWorkEs?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() relatedWorkEn?: string;
  @ApiProperty() @IsString() commentEs!: string;
  @ApiProperty() @IsString() commentEn!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() artistUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isPublished?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsInt() displayOrder?: number;
}

export class UpdateTestimonialDto extends PartialType(CreateTestimonialDto) {}
