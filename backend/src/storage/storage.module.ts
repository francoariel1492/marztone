import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StorageService } from './storage.service';
import { LocalStorageService } from './local-storage.service';
import { CloudinaryStorageService } from './cloudinary-storage.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: StorageService,
      inject: [ConfigService],
      useFactory: (config: ConfigService): StorageService => {
        const provider = config.get<string>('storage.provider');
        return provider === 'cloudinary'
          ? new CloudinaryStorageService(config)
          : new LocalStorageService(config);
      },
    },
  ],
  exports: [StorageService],
})
export class StorageModule {}
