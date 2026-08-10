import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto, UpdateServiceDto } from './dto/service.dto';
import { Service } from '@prisma/client';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<Service[]> {
    return this.prisma.service.findMany({ orderBy: { displayOrder: 'asc' } });
  }

  findPublic(): Promise<Service[]> {
    return this.prisma.service.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });
  }

  create(dto: CreateServiceDto): Promise<Service> {
    return this.prisma.service.create({ data: dto });
  }

  async update(id: string, dto: UpdateServiceDto): Promise<Service> {
    await this.ensureExists(id);
    return this.prisma.service.update({ where: { id }, data: dto });
  }

  async remove(id: string): Promise<void> {
    await this.ensureExists(id);
    await this.prisma.service.delete({ where: { id } });
  }

  private async ensureExists(id: string): Promise<void> {
    const found = await this.prisma.service.findUnique({ where: { id } });
    if (!found) {
      throw new NotFoundException('Servicio no encontrado');
    }
  }
}
