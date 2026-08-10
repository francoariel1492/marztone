import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkshopImageDto, UpdateWorkshopImageDto } from './dto/workshop-image.dto';
import { WorkshopImage } from '@prisma/client';

@Injectable()
export class WorkshopService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<WorkshopImage[]> {
    return this.prisma.workshopImage.findMany({ orderBy: { displayOrder: 'asc' } });
  }

  findPublic(): Promise<WorkshopImage[]> {
    return this.prisma.workshopImage.findMany({
      where: { isPublished: true },
      orderBy: { displayOrder: 'asc' },
    });
  }

  create(dto: CreateWorkshopImageDto): Promise<WorkshopImage> {
    return this.prisma.workshopImage.create({ data: dto });
  }

  async update(id: string, dto: UpdateWorkshopImageDto): Promise<WorkshopImage> {
    await this.ensureExists(id);
    return this.prisma.workshopImage.update({ where: { id }, data: dto });
  }

  async remove(id: string): Promise<void> {
    await this.ensureExists(id);
    await this.prisma.workshopImage.delete({ where: { id } });
  }

  private async ensureExists(id: string): Promise<void> {
    const found = await this.prisma.workshopImage.findUnique({ where: { id } });
    if (!found) {
      throw new NotFoundException('Imagen de taller no encontrada');
    }
  }
}
