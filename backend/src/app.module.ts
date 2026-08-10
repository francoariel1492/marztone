import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import configuration from './config/configuration';
import { PrismaModule } from './prisma/prisma.module';
import { StorageModule } from './storage/storage.module';
import { MailModule } from './mail/mail.module';
import { AuthModule } from './auth/auth.module';
import { SettingsModule } from './settings/settings.module';
import { SectionsModule } from './sections/sections.module';
import { WorkshopModule } from './workshop/workshop.module';
import { InstrumentCategoriesModule } from './instrument-categories/instrument-categories.module';
import { InstrumentsModule } from './instruments/instruments.module';
import { ArtistsModule } from './artists/artists.module';
import { ServicesModule } from './services/services.module';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { ContactModule } from './contact/contact.module';
import { MessagesModule } from './messages/messages.module';
import { MediaModule } from './media/media.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { PublicContentModule } from './public-content/public-content.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),
    PrismaModule,
    StorageModule,
    MailModule,
    AuthModule,
    SettingsModule,
    SectionsModule,
    WorkshopModule,
    InstrumentCategoriesModule,
    InstrumentsModule,
    ArtistsModule,
    ServicesModule,
    TestimonialsModule,
    ContactModule,
    MessagesModule,
    MediaModule,
    DashboardModule,
    PublicContentModule,
    HealthModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
