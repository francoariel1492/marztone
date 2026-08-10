import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SettingsService } from '../settings/settings.service';
import { SectionsService } from '../sections/sections.service';
import { WorkshopService } from '../workshop/workshop.service';
import { InstrumentCategoriesService } from '../instrument-categories/instrument-categories.service';
import { InstrumentsService } from '../instruments/instruments.service';
import { ArtistsService } from '../artists/artists.service';
import { ServicesService } from '../services/services.service';
import { TestimonialsService } from '../testimonials/testimonials.service';
import { InstrumentQueryDto } from '../instruments/dto/instrument-query.dto';
import { PaginationQueryDto } from '../common/dto/pagination.dto';

@ApiTags('public')
@Controller('public')
export class PublicContentController {
  constructor(
    private readonly settings: SettingsService,
    private readonly sections: SectionsService,
    private readonly workshop: WorkshopService,
    private readonly categories: InstrumentCategoriesService,
    private readonly instruments: InstrumentsService,
    private readonly artists: ArtistsService,
    private readonly services: ServicesService,
    private readonly testimonials: TestimonialsService,
  ) {}

  @Get('settings')
  getSettings() {
    return this.settings.get();
  }

  @Get('sections')
  getSections() {
    return this.sections.findPublic();
  }

  @Get('workshop')
  getWorkshop() {
    return this.workshop.findPublic();
  }

  @Get('instrument-categories')
  getCategories() {
    return this.categories.findPublic();
  }

  @Get('instruments')
  getInstruments(@Query() query: InstrumentQueryDto) {
    return this.instruments.findMany({
      page: query.page,
      limit: query.limit,
      search: query.search,
      category: query.category,
      includeUnpublished: false,
    });
  }

  @Get('instruments/:slug')
  getInstrument(@Param('slug') slug: string) {
    return this.instruments.findBySlug(slug, false);
  }

  @Get('artists')
  getArtists(@Query() query: PaginationQueryDto) {
    return this.artists.findMany(query.page, query.limit, query.search, false);
  }

  @Get('artists/:slug')
  getArtist(@Param('slug') slug: string) {
    return this.artists.findBySlug(slug, false);
  }

  @Get('services')
  getServices() {
    return this.services.findPublic();
  }

  @Get('testimonials')
  getTestimonials() {
    return this.testimonials.findPublic();
  }
}
