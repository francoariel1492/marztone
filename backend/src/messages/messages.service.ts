import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PaginatedResult, paginate } from '../common/dto/pagination.dto';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(page: number, limit: number, search?: string): Promise<PaginatedResult<unknown>> {
    const where: Prisma.ContactMessageWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { subject: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};
    const [data, total] = await Promise.all([
      this.prisma.contactMessage.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.contactMessage.count({ where }),
    ]);
    return paginate(data, total, page, limit);
  }

  async findById(id: string) {
    const message = await this.prisma.contactMessage.findUnique({ where: { id } });
    if (!message) {
      throw new NotFoundException('Mensaje no encontrado');
    }
    return message;
  }

  async markRead(id: string) {
    await this.findById(id);
    return this.prisma.contactMessage.update({ where: { id }, data: { isRead: true } });
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.prisma.contactMessage.delete({ where: { id } });
  }
}
