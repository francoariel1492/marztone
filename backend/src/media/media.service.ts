import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { PaginatedResult, paginate } from '../common/dto/pagination.dto';
import { MediaFile } from '@prisma/client';

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/heic', 'image/heif'];

@Injectable()
export class MediaService {
  private readonly maxBytes: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
    config: ConfigService,
  ) {
    this.maxBytes = (config.get<number>('storage.maxFileSizeMb') ?? 5) * 1024 * 1024;
  }

  async list(page: number, limit: number): Promise<PaginatedResult<MediaFile>> {
    const [data, total] = await Promise.all([
      this.prisma.mediaFile.findMany({
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.mediaFile.count(),
    ]);
    return paginate(data, total, page, limit);
  }

  async upload(
    file: Express.Multer.File,
    alt?: { altEs?: string; altEn?: string },
  ): Promise<MediaFile> {
    if (!file) {
      throw new BadRequestException('No se recibió ningún archivo');
    }
    if (!ALLOWED_MIME.includes(file.mimetype)) {
      throw new BadRequestException('Formato no permitido. Usá JPEG, PNG, WebP o AVIF.');
    }
    if (file.size > this.maxBytes) {
      throw new BadRequestException('El archivo supera el tamaño máximo permitido');
    }

    const stored = await this.storage.upload({
      buffer: file.buffer,
      originalName: file.originalname,
      mimeType: file.mimetype,
    });

    return this.prisma.mediaFile.create({
      data: {
        url: stored.url,
        storageKey: stored.storageKey,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        width: stored.width,
        height: stored.height,
        altEs: alt?.altEs,
        altEn: alt?.altEn,
      },
    });
  }

  async remove(id: string): Promise<void> {
    const media = await this.prisma.mediaFile.findUnique({ where: { id } });
    if (!media) {
      throw new NotFoundException('Archivo no encontrado');
    }
    await this.storage.remove(media.storageKey);
    await this.prisma.mediaFile.delete({ where: { id } });
  }
}
