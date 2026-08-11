import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { join } from 'path';
import { existsSync } from 'fs';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  const config = app.get(ConfigService);
  const frontendUrl = config.get<string>('frontendUrl') ?? 'http://localhost:5173';
  const allowedOrigins = frontendUrl.split(',').map((o) => o.trim());

  app.setGlobalPrefix('api');
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: {
        directives: {
          ...helmet.contentSecurityPolicy.getDefaultDirectives(),
          'img-src': ["'self'", 'data:', 'blob:', 'https:'],
          'media-src': ["'self'", 'data:', 'https:'],
          'connect-src': ["'self'", 'https:'],
          'frame-src': ["'self'", 'https://www.youtube.com', 'https://www.youtube-nocookie.com'],
          'font-src': ["'self'", 'https:', 'data:'],
          'style-src': ["'self'", 'https:', "'unsafe-inline'"],
        },
      },
    }),
  );
  app.use(cookieParser());
  app.enableCors({ origin: allowedOrigins, credentials: true });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());

  // Servir imágenes locales en desarrollo (STORAGE_PROVIDER=local)
  app.useStaticAssets(join(process.cwd(), config.get<string>('storage.localDir') ?? 'uploads'), {
    prefix: '/uploads/',
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('MarzTone API')
    .setDescription('API de MarzTone by Manuel Robles Urquiza')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  // Sirve el frontend compilado (si está presente) desde el mismo servicio.
  const clientDir = join(process.cwd(), 'client');
  if (existsSync(clientDir)) {
    app.useStaticAssets(clientDir);
    const expressApp = app.getHttpAdapter().getInstance();
    // Fallback SPA: rutas que no son /api ni /uploads devuelven index.html
    expressApp.use((req: { method: string; path: string }, res: { sendFile: (p: string) => void }, next: () => void) => {
      if (
        req.method === 'GET' &&
        !req.path.startsWith('/api') &&
        !req.path.startsWith('/uploads') &&
        !req.path.includes('.')
      ) {
        return res.sendFile(join(clientDir, 'index.html'));
      }
      next();
    });
  }

  const port = config.get<number>('port') ?? 3000;
  await app.listen(port, '0.0.0.0');
  Logger.log(`🎸 MarzTone en 0.0.0.0:${port} (API en /api, web servida desde /)`, 'Bootstrap');
}

bootstrap();
