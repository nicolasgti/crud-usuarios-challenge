import { Controller, Get, Post, Body, UnauthorizedException, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('Auth') // Define a tag para o grupo de rotas de autenticação no Swagger
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth() // Indica que a rota requer autenticação com JWT
  @ApiOperation({ summary: 'Obter perfil do usuário autenticado' })
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @ApiOperation({ summary: 'Realizar login e obter token JWT' })
  @ApiBody({
    description: 'Credenciais de login',
    schema: {
      type: 'object',
      properties: {
        login: { type: 'string', example: 'admin' },
        email: { type: 'string', example: 'admin@example.com' },
        password: { type: 'string', example: 'admin123' },
      },
    },
  })
  @Post('login')
  async login(@Body() body: any) {
    console.log('Body recebido:', body);
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

  @ApiOperation({ summary: 'Solicitar redefinição de senha' })
  @ApiBody({
    description: 'E-mail do usuário para redefinição de senha',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
      },
    },
  })
  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @ApiOperation({ summary: 'Solicitar token para redefinição de senha' })
  @ApiBody({
    description: 'E-mail do usuário para solicitar token de redefinição',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
      },
    },
  })
  @Post('request-password-reset')
  async requestPasswordReset(@Body('email') email: string) {
    return this.authService.requestPasswordReset(email);
  }

  @ApiOperation({ summary: 'Redefinir senha com token' })
  @ApiBody({
    description: 'Token de redefinição e nova senha',
    schema: {
      type: 'object',
      properties: {
        token: { type: 'string', example: 'reset-token' },
        newPassword: { type: 'string', example: 'newPassword123' },
      },
    },
  })
  @Post('reset-password')
  async resetPassword(@Body('token') token: string, @Body('newPassword') newPassword: string) {
    return this.authService.resetPassword(token, newPassword);
  }
}