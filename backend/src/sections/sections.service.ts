import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSectionDto } from './dto/update-section.dto';
import { CreateSectionDto } from './dto/create-section.dto';
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

  async create(dto: CreateSectionDto): Promise<PageSection> {
    const last = await this.prisma.pageSection.findFirst({
      orderBy: { displayOrder: 'desc' },
    });
    const { key, displayOrder, ...rest } = dto;
    return this.prisma.pageSection.create({
      data: {
        ...rest,
        key: key?.trim() || `custom-${randomUUID().slice(0, 8)}`,
        displayOrder: displayOrder ?? (last ? last.displayOrder + 1 : 0),
      },
    });
  }

  async update(id: string, dto: UpdateSectionDto): Promise<PageSection> {
    await this.ensureExists(id);
    return this.prisma.pageSection.update({ where: { id }, data: dto });
  }

  async remove(id: string): Promise<void> {
    await this.ensureExists(id);
    await this.prisma.pageSection.delete({ where: { id } });
  }

  private async ensureExists(id: string): Promise<void> {
    const found = await this.prisma.pageSection.findUnique({ where: { id } });
    if (!found) {
      throw new NotFoundException('Sección no encontrada');
    }
  }
}
