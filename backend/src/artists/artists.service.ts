import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArtistDto, UpdateArtistDto } from './dto/artist.dto';
import { PaginatedResult, paginate } from '../common/dto/pagination.dto';

@Injectable()
export class ArtistsService {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(
    page: number,
    limit: number,
    search?: string,
    includeUnpublished = false,
  ): Promise<PaginatedResult<unknown>> {
    const where: Prisma.ArtistWhereInput = {
      deletedAt: null,
      ...(includeUnpublished ? {} : { isPublished: true }),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { stageName: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };
    const [data, total] = await Promise.all([
      this.prisma.artist.findMany({
        where,
        orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.artist.count({ where }),
    ]);
    return paginate(data, total, page, limit);
  }

  async findBySlug(slug: string, includeUnpublished = false) {
    const artist = await this.prisma.artist.findFirst({
      where: { slug, deletedAt: null, ...(includeUnpublished ? {} : { isPublished: true }) },
    });
    if (!artist) {
      throw new NotFoundException('Artista no encontrado');
    }
    return artist;
  }

  async findById(id: string) {
    const artist = await this.prisma.artist.findFirst({ where: { id, deletedAt: null } });
    if (!artist) {
      throw new NotFoundException('Artista no encontrado');
    }
    return artist;
  }

  create(dto: CreateArtistDto) {
    return this.prisma.artist.create({ data: dto });
  }

  async update(id: string, dto: UpdateArtistDto) {
    await this.findById(id);
    return this.prisma.artist.update({ where: { id }, data: dto });
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.prisma.artist.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
