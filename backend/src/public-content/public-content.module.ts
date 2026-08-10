import { Module } from '@nestjs/common';
import { PublicContentController } from './public-content.controller';
import { SettingsModule } from '../settings/settings.module';
import { SectionsModule } from '../sections/sections.module';
import { WorkshopModule } from '../workshop/workshop.module';
import { InstrumentCategoriesModule } from '../instrument-categories/instrument-categories.module';
import { InstrumentsModule } from '../instruments/instruments.module';
import { ArtistsModule } from '../artists/artists.module';
import { ServicesModule } from '../services/services.module';
import { TestimonialsModule } from '../testimonials/testimonials.module';

@Module({
  imports: [
    SettingsModule,
    SectionsModule,
    WorkshopModule,
    InstrumentCategoriesModule,
    InstrumentsModule,
    ArtistsModule,
    ServicesModule,
    TestimonialsModule,
  ],
  controllers: [PublicContentController],
})
export class PublicContentModule {}
