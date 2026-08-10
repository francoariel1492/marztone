import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { InstrumentCategory } from '@prisma/client';

@Injectable()
export class InstrumentCategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<InstrumentCategory[]> {
    return this.prisma.instrumentCategory.findMany({ orderBy: { displayOrder: 'asc' } });
  }

  findPublic(): Promise<InstrumentCategory[]> {
    return this.prisma.instrumentCategory.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });
  }

  create(dto: CreateCategoryDto): Promise<InstrumentCategory> {
    return this.prisma.instrumentCategory.create({ data: dto });
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<InstrumentCategory> {
    await this.ensureExists(id);
    return this.prisma.instrumentCategory.update({ where: { id }, data: dto });
  }

  async remove(id: string): Promise<void> {
    await this.ensureExists(id);
    const count = await this.prisma.instrument.count({ where: { categoryId: id } });
    if (count > 0) {
      throw new BadRequestException('No se puede eliminar: hay instrumentos en esta categoría');
    }
    await this.prisma.instrumentCategory.delete({ where: { id } });
  }

  private async ensureExists(id: string): Promise<void> {
    const found = await this.prisma.instrumentCategory.findUnique({ where: { id } });
    if (!found) {
      throw new NotFoundException('Categoría no encontrada');
    }
  }
}
