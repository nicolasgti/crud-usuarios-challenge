import { Controller, Get, Post, Body, UnauthorizedException, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('login')
  async login(@Body() body: any) {
    console.log('Body recebido:', body)
    const identifier = body.login || body.email;
    const password = body.password;

  const user = await this.authService.validateUser(identifier, password);

    const token = await this.authService.login(user);

    return {
      access_token: token.access_token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        matricula: user.matricula,
      },
    };
  }


  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  
  @Post('request-password-reset')
  async requestPasswordReset(@Body('email') email: string) {
    return this.authService.requestPasswordReset(email);
  }

  @Post('reset-password')
  async resetPassword(@Body('token') token: string, @Body('newPassword') newPassword: string) {
    return this.authService.resetPassword(token, newPassword);
  }
}