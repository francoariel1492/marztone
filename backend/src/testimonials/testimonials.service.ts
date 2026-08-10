import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTestimonialDto, UpdateTestimonialDto } from './dto/testimonial.dto';
import { Testimonial } from '@prisma/client';

@Injectable()
export class TestimonialsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<Testimonial[]> {
    return this.prisma.testimonial.findMany({ orderBy: { displayOrder: 'asc' } });
  }

  findPublic(): Promise<Testimonial[]> {
    return this.prisma.testimonial.findMany({
      where: { isPublished: true },
      orderBy: { displayOrder: 'asc' },
    });
  }

  create(dto: CreateTestimonialDto): Promise<Testimonial> {
    return this.prisma.testimonial.create({ data: dto });
  }

  async update(id: string, dto: UpdateTestimonialDto): Promise<Testimonial> {
    await this.ensureExists(id);
    return this.prisma.testimonial.update({ where: { id }, data: dto });
  }

  async remove(id: string): Promise<void> {
    await this.ensureExists(id);
    await this.prisma.testimonial.delete({ where: { id } });
  }

  private async ensureExists(id: string): Promise<void> {
    const found = await this.prisma.testimonial.findUnique({ where: { id } });
    if (!found) {
      throw new NotFoundException('Testimonio no encontrado');
    }
  }
}
