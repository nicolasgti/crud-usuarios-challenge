import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('Profile') // Define a tag para o grupo de rotas de perfil no Swagger
@Controller('profile')
export class ProfileController {
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth() // Indica que a rota requer autenticação com JWT
  @ApiOperation({ summary: 'Obter perfil do usuário autenticado' })
  @Get()
  getProfile(@Request() req) {
    return req.user;
  }
}