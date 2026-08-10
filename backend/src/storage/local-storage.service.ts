import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { promises as fs } from 'fs';
import { join, extname } from 'path';
import sharp from 'sharp';
import { StorageService, StoredFile, UploadInput } from './storage.service';

/**
 * Almacenamiento local para desarrollo. Optimiza a WebP y genera thumbnail.
 */
@Injectable()
export class LocalStorageService extends StorageService {
  private readonly logger = new Logger('LocalStorage');
  private readonly dir: string;
  private readonly publicUrl: string;

  constructor(private readonly config: ConfigService) {
    super();
    this.dir = this.config.get<string>('storage.localDir') ?? 'uploads';
    this.publicUrl = this.config.get<string>('storage.publicUrl') ?? 'http://localhost:3000/uploads';
  }

  async upload(input: UploadInput): Promise<StoredFile> {
    await fs.mkdir(this.dir, { recursive: true });
    const id = randomUUID();
    const baseName = `${id}`;
    let width: number | undefined;
    let height: number | undefined;
    let fileName = `${baseName}${extname(input.originalName).toLowerCase() || '.bin'}`;

    if (input.mimeType.startsWith('image/')) {
      const image = sharp(input.buffer).rotate();
      const meta = await image.metadata();
      width = meta.width;
      height = meta.height;
      fileName = `${baseName}.webp`;
      const optimized = await image.webp({ quality: 82 }).toBuffer();
      await fs.writeFile(join(this.dir, fileName), optimized);
      // thumbnail
      const thumb = await sharp(input.buffer)
        .rotate()
        .resize(400, 400, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 72 })
        .toBuffer();
      await fs.writeFile(join(this.dir, `${baseName}_thumb.webp`), thumb);
    } else {
      await fs.writeFile(join(this.dir, fileName), input.buffer);
    }

    return {
      url: `${this.publicUrl}/${fileName}`,
      storageKey: fileName,
      width,
      height,
    };
  }

  async remove(storageKey: string): Promise<void> {
    try {
      await fs.unlink(join(this.dir, storageKey));
      const thumb = storageKey.replace(/(\.[^.]+)$/, '_thumb$1');
      await fs.unlink(join(this.dir, thumb)).catch(() => undefined);
    } catch (err) {
      this.logger.warn(`No se pudo eliminar ${storageKey}`);
    }
  }
}
