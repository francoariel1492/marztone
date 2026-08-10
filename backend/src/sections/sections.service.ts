import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSectionDto } from './dto/update-section.dto';
import { PageSection } from '@prisma/client';

@Injectable()
export class SectionsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<PageSection[]> {
    return this.prisma.pageSection.findMany({ orderBy: { displayOrder: 'asc' } });
  }

  findPublic(): Promise<PageSection[]> {
    return this.prisma.pageSection.findMany({
      where: { isVisible: true },
      orderBy: { displayOrder: 'asc' },
    });
  }

  async update(id: string, dto: UpdateSectionDto): Promise<PageSection> {
    await this.ensureExists(id);
    return this.prisma.pageSection.update({ where: { id }, data: dto });
  }

  private async ensureExists(id: string): Promise<void> {
    const found = await this.prisma.pageSection.findUnique({ where: { id } });
    if (!found) {
      throw new NotFoundException('Sección no encontrada');
    }
  }
}
