import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('App') // Define uma tag para o grupo de rotas gerais no Swagger
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Obter mensagem de boas-vindas' })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}