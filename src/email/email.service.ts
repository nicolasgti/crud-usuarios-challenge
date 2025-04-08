import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendPasswordResetEmail(to: string, token: string) {
    const resetLink = `http://localhost:3000/auth/reset-password?token=${token}`;

    const info = await this.transporter.sendMail({
      from: '"Support" <no-reply@example.com>',
      to,
      subject: 'Recuperação de Senha',
      text: `Clique no link para redefinir sua senha: ${resetLink}`,
      html: `<p>Clique no link para redefinir sua senha: <a href="${resetLink}">${resetLink}</a></p>`,
    });

    return info;
  }
}
