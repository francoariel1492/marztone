import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { SiteSettings } from '@prisma/client';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async get(): Promise<SiteSettings> {
    const settings = await this.prisma.siteSettings.findFirst();
    if (!settings) {
      throw new NotFoundException('No hay configuración. Ejecutá el seed.');
    }
    return settings;
  }

  async update(dto: UpdateSettingsDto): Promise<SiteSettings> {
    const current = await this.get();
    return this.prisma.siteSettings.update({ where: { id: current.id }, data: dto });
  }
}
