import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const [
      instruments,
      publishedInstruments,
      artists,
      services,
      messages,
      unreadMessages,
      latestMessages,
    ] = await Promise.all([
      this.prisma.instrument.count({ where: { deletedAt: null } }),
      this.prisma.instrument.count({ where: { deletedAt: null, isPublished: true } }),
      this.prisma.artist.count({ where: { deletedAt: null } }),
      this.prisma.service.count(),
      this.prisma.contactMessage.count(),
      this.prisma.contactMessage.count({ where: { isRead: false } }),
      this.prisma.contactMessage.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          name: true,
          email: true,
          subject: true,
          isRead: true,
          createdAt: true,
        },
      }),
    ]);

    return {
      counts: {
        instruments,
        publishedInstruments,
        hiddenInstruments: instruments - publishedInstruments,
        artists,
        services,
        messages,
        unreadMessages,
      },
      latestMessages,
    };
  }
}
