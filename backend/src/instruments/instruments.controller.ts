import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { InstrumentsService } from './instruments.service';
import { CreateInstrumentDto, UpdateInstrumentDto } from './dto/instrument.dto';
import { InstrumentQueryDto } from './dto/instrument-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('admin/instruments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/instruments')
export class InstrumentsController {
  constructor(private readonly instruments: InstrumentsService) {}

  @Get()
  findMany(@Query() query: InstrumentQueryDto) {
    return this.instruments.findMany({
      page: query.page,
      limit: query.limit,
      search: query.search,
      category: query.category,
      includeUnpublished: true,
    });
  }

  @Get(':id')
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.instruments.findById(id);
  }

  @Post()
  create(@Body() dto: CreateInstrumentDto) {
    return this.instruments.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateInstrumentDto) {
    return this.instruments.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.instruments.remove(id);
  }
}
