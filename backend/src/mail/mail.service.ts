import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

export interface ContactMailData {
  name: string;
  email: string;
  phone?: string | null;
  inquiryType: string;
  subject: string;
  message: string;
  language: string;
  createdAt: Date;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger('Mail');
  private readonly transporter: nodemailer.Transporter;

  constructor(private readonly config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get<string>('mail.host'),
      port: this.config.get<number>('mail.port'),
      secure: this.config.get<boolean>('mail.secure'),
      auth: {
        user: this.config.get<string>('mail.user'),
        pass: this.config.get<string>('mail.password'),
      },
    });
  }

  async sendContactNotification(data: ContactMailData): Promise<void> {
    const from = this.config.get<string>('mail.from');
    const to = this.config.get<string>('mail.to');

    await this.transporter.sendMail({
      from,
      to,
      replyTo: data.email,
      subject: 'New contact from MarzTone website',
      html: this.buildHtml(data),
    });
  }

  private buildHtml(d: ContactMailData): string {
    const row = (label: string, value: string) =>
      `<tr><td style="padding:6px 12px;font-weight:600;color:#5b4636;">${label}</td><td style="padding:6px 12px;color:#2b1d16;">${this.escape(value)}</td></tr>`;
    return `
      <div style="font-family:Georgia,serif;background:#f4ede1;padding:24px;color:#2b1d16;">
        <h2 style="color:#8a5a2b;margin:0 0 4px;">MarzTone</h2>
        <p style="margin:0 0 16px;font-size:13px;color:#8a5a2b;">by Manuel Robles Urquiza</p>
        <p style="margin:0 0 16px;">Nuevo mensaje desde el formulario de contacto:</p>
        <table style="border-collapse:collapse;background:#fff;border:1px solid #e0d3c0;width:100%;">
          ${row('Nombre', d.name)}
          ${row('Email', d.email)}
          ${row('Teléfono', d.phone ?? '—')}
          ${row('Tipo de consulta', d.inquiryType)}
          ${row('Asunto', d.subject)}
          ${row('Mensaje', d.message)}
          ${row('Idioma', d.language)}
          ${row('Fecha', d.createdAt.toISOString())}
        </table>
      </div>`;
  }

  private escape(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}
