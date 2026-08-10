import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Language } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';

@Injectable()
export class ContactService {
  private readonly logger = new Logger('Contact');

  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
  ) {}

  async submit(dto: CreateContactMessageDto): Promise<{ success: true }> {
    // Honeypot: si el campo oculto viene relleno, descartamos silenciosamente.
    if (dto.website && dto.website.trim().length > 0) {
      return { success: true };
    }
    if (!dto.consent) {
      throw new BadRequestException('Debés aceptar el consentimiento para continuar');
    }

    const message = await this.prisma.contactMessage.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        inquiryType: dto.inquiryType,
        subject: dto.subject,
        message: dto.message,
        language: dto.language ?? Language.ES,
      },
    });

    // El email no debe bloquear la respuesta; si falla, conservamos el mensaje.
    try {
      await this.mail.sendContactNotification({
        name: message.name,
        email: message.email,
        phone: message.phone,
        inquiryType: message.inquiryType,
        subject: message.subject,
        message: message.message,
        language: message.language,
        createdAt: message.createdAt,
      });
    } catch {
      this.logger.error('No se pudo enviar el email de notificación; el mensaje quedó guardado.');
    }

    return { success: true };
  }
}
