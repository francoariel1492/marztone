import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { WorkshopService } from './workshop.service';
import { CreateWorkshopImageDto, UpdateWorkshopImageDto } from './dto/workshop-image.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('admin/workshop')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/workshop')
export class WorkshopController {
  constructor(private readonly workshop: WorkshopService) {}

  @Get()
  findAll() {
    return this.workshop.findAll();
  }

  @Post()
  create(@Body() dto: CreateWorkshopImageDto) {
    return this.workshop.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateWorkshopImageDto) {
    return this.workshop.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.workshop.remove(id);
  }
}
