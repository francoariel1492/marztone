import { Test } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { ContactService } from './contact.service';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';

describe('ContactService', () => {
  let service: ContactService;
  let prisma: { contactMessage: { create: jest.Mock } };
  let mail: { sendContactNotification: jest.Mock };

  const baseDto = {
    name: 'Test',
    email: 'test@example.com',
    inquiryType: 'general',
    subject: 'Hola',
    message: 'Mensaje de prueba largo',
    consent: true,
  };

  beforeEach(async () => {
    prisma = {
      contactMessage: { create: jest.fn().mockResolvedValue({ ...baseDto, createdAt: new Date() }) },
    };
    mail = { sendContactNotification: jest.fn().mockResolvedValue(undefined) };

    const moduleRef = await Test.createTestingModule({
      providers: [
        ContactService,
        { provide: PrismaService, useValue: prisma },
        { provide: MailService, useValue: mail },
      ],
    }).compile();

    service = moduleRef.get(ContactService);
  });

  it('descarta silenciosamente si el honeypot está relleno', async () => {
    const result = await service.submit({ ...baseDto, website: 'spam' });
    expect(result).toEqual({ success: true });
    expect(prisma.contactMessage.create).not.toHaveBeenCalled();
  });

  it('rechaza si no hay consentimiento', async () => {
    await expect(service.submit({ ...baseDto, consent: false })).rejects.toThrow(
      BadRequestException,
    );
  });

  it('guarda el mensaje y envía email', async () => {
    const result = await service.submit(baseDto);
    expect(result).toEqual({ success: true });
    expect(prisma.contactMessage.create).toHaveBeenCalled();
    expect(mail.sendContactNotification).toHaveBeenCalled();
  });
});
