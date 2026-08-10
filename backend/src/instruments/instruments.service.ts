import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInstrumentDto, UpdateInstrumentDto } from './dto/instrument.dto';
import { PaginatedResult, paginate } from '../common/dto/pagination.dto';

export interface InstrumentFilters {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  includeUnpublished?: boolean;
}

@Injectable()
export class InstrumentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(filters: InstrumentFilters): Promise<PaginatedResult<unknown>> {
    const { page, limit, search, category, includeUnpublished } = filters;
    const where: Prisma.InstrumentWhereInput = {
      deletedAt: null,
      ...(includeUnpublished ? {} : { isPublished: true }),
      ...(category && category !== 'all' ? { category: { slug: category } } : {}),
      ...(search
        ? {
            OR: [
              { nameEs: { contains: search, mode: 'insensitive' } },
              { nameEn: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.instrument.findMany({
        where,
        include: { category: true, images: { orderBy: { displayOrder: 'asc' } } },
        orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.instrument.count({ where }),
    ]);
    return paginate(data, total, page, limit);
  }

  async findBySlug(slug: string, includeUnpublished = false) {
    const instrument = await this.prisma.instrument.findFirst({
      where: {
        slug,
        deletedAt: null,
        ...(includeUnpublished ? {} : { isPublished: true }),
      },
      include: { category: true, images: { orderBy: { displayOrder: 'asc' } } },
    });
    if (!instrument) {
      throw new NotFoundException('Instrumento no encontrado');
    }
    return instrument;
  }

  async findById(id: string) {
    const instrument = await this.prisma.instrument.findFirst({
      where: { id, deletedAt: null },
      include: { category: true, images: { orderBy: { displayOrder: 'asc' } } },
    });
    if (!instrument) {
      throw new NotFoundException('Instrumento no encontrado');
    }
    return instrument;
  }

  async create(dto: CreateInstrumentDto) {
    const { images, price, ...rest } = dto;
    return this.prisma.instrument.create({
      data: {
        ...rest,
        price: price != null ? new Prisma.Decimal(price) : null,
        images: images?.length ? { create: images } : undefined,
      },
      include: { category: true, images: true },
    });
  }

  async update(id: string, dto: UpdateInstrumentDto) {
    await this.findById(id);
    const { images, price, ...rest } = dto;
    return this.prisma.instrument.update({
      where: { id },
      data: {
        ...rest,
        ...(price !== undefined ? { price: price != null ? new Prisma.Decimal(price) : null } : {}),
        ...(images
          ? { images: { deleteMany: {}, create: images } }
          : {}),
      },
      include: { category: true, images: { orderBy: { displayOrder: 'asc' } } },
    });
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.prisma.instrument.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
