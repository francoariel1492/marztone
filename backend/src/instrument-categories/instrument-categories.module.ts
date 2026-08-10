import { Module } from '@nestjs/common';
import { InstrumentCategoriesController } from './instrument-categories.controller';
import { InstrumentCategoriesService } from './instrument-categories.service';

@Module({
  controllers: [InstrumentCategoriesController],
  providers: [InstrumentCategoriesService],
  exports: [InstrumentCategoriesService],
})
export class InstrumentCategoriesModule {}
