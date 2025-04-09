import { 
  Controller, Get, Post, Body, Param, Put, Delete, ValidationPipe, UseGuards, Query 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Users') // Define a tag para o grupo de rotas de usuários no Swagger
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth() // Indica que a rota requer autenticação com JWT
  @ApiOperation({ summary: 'Criar um novo usuário' })
  @ApiBody({
    description: 'Dados para criação de um novo usuário',
    type: CreateUserDto,
  })
  @Post()
  create(@Body(new ValidationPipe()) user: CreateUserDto) {
    return this.usersService.create(user);
  }

  @ApiOperation({ summary: 'Listar todos os usuários com paginação' })
  @ApiQuery({ name: 'page', required: false, description: 'Número da página', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Limite de itens por página', example: 10 })
  @ApiQuery({ name: 'search', required: false, description: 'Termo de busca', example: 'admin' })
  @Get()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string
  ) {
    return this.usersService.findAllPaginated(+page, +limit, search);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter detalhes de um usuário pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do usuário', example: 1 })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar informações de um usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário', example: 1 })
  @ApiBody({
    description: 'Dados para atualização do usuário',
    schema: {
      type: 'object',
      properties: {
        // Define the properties of the partial user object here
        name: { type: 'string', nullable: true },
        email: { type: 'string', nullable: true },
        // Add other fields as needed
      },
    },
  })
  @Put(':id')
  update(@Param('id') id: string, @Body() user: Partial<User>) {
    return this.usersService.update(+id, user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover um usuário pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do usuário', example: 1 })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}