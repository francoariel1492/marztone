import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { StorageService, StoredFile, UploadInput } from './storage.service';

/**
 * Almacenamiento en Cloudinary para producción.
 * Estructura compatible para migrar a S3 / Cloudflare R2 implementando StorageService.
 */
@Injectable()
export class CloudinaryStorageService extends StorageService {
  private readonly logger = new Logger('CloudinaryStorage');

  constructor(private readonly config: ConfigService) {
    super();
    cloudinary.config({
      cloud_name: this.config.get<string>('storage.cloudinary.cloudName'),
      api_key: this.config.get<string>('storage.cloudinary.apiKey'),
      api_secret: this.config.get<string>('storage.cloudinary.apiSecret'),
      secure: true,
    });
  }

  async upload(input: UploadInput): Promise<StoredFile> {
    return new Promise<StoredFile>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'marztone', resource_type: 'image', format: 'webp' },
        (error, result) => {
          if (error || !result) {
            this.logger.error('Error subiendo a Cloudinary');
            return reject(new InternalServerErrorException('Error al subir la imagen'));
          }
          resolve({
            url: result.secure_url,
            storageKey: result.public_id,
            width: result.width,
            height: result.height,
          });
        },
      );
      stream.end(input.buffer);
    });
  }

  async remove(storageKey: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(storageKey);
    } catch {
      this.logger.warn(`No se pudo eliminar ${storageKey} de Cloudinary`);
    }
  }
}
