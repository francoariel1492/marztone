import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';

export class InstrumentQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Slug de categoría o "all"' })
  @IsOptional()
  @IsString()
  category?: string;
}
