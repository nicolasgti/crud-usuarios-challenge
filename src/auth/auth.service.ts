import { Injectable, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { EmailService } from 'src/email/email.service'; 
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async requestPasswordReset(email: string) {
    const user = await this.userService.findByEmailOrMatricula(email);
    if (!user) {
      throw new NotFoundException('Email não registrado');
    }

    const token = this.jwtService.sign({ email }, { expiresIn: '15m' });

    await this.emailService.sendPasswordResetEmail(email, token);

    return { message: 'Email enviado' };
  }

  async validateUser(identifier: string, password: string): Promise<any> {
    const user = await this.userService.findByEmailOrMatricula(identifier);
    console.log('login:', identifier);
  
    if (!user) {
      console.log('Usuário não encontrado');
      throw new UnauthorizedException('Credenciais inválidas');
    }
  
    const isPasswordValid = await bcrypt.compare(password, user.senha);
  
    if (!isPasswordValid) {
      console.log(user);
      console.log('Senha incorreta');
      throw new UnauthorizedException('Credenciais inválidas');
    }
  
    const { senha, ...result } = user;
    return result;
  }
  

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('E-mail não cadastrado. Contate o admin');
    }
  
    // Gerar token JWT para recuperação de senha (expira em 15 min)
    const resetToken = this.jwtService.sign({ email }, { expiresIn: '15m' });
  
    // Salvar o token no banco (ou cache) para validar depois
    user.resetPasswordToken = resetToken;
    await this.userService.update(user.id, user);
  
    // Aqui você deve enviar um e-mail com o link de redefinição
    // Exemplo: `http://frontend.com/reset-password?token=${resetToken}`
    
    return { message: 'Password reset link sent to your email' };
  }

  async resetPassword(token: string, newPassword: string) {
    let decoded;
    try {
      decoded = this.jwtService.verify(token);
    } catch (error) {
      throw new BadRequestException('Token inválido ou expirado');
    }
  
    const user = await this.userService.findByEmail(decoded.email);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
  
    user.senha = await bcrypt.hash(newPassword, 10);
    await this.userService.update(user.id, { senha: user.senha });
  
    return { message: 'Senha redefinida com sucesso' };
  }
  
}
