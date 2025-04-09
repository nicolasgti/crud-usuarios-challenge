import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:5173', // ou '*', se for só pra teste
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('WenLock API')
    .setDescription('Documentação da API do sistema WenLock')
    .setVersion('1.0')
    .addBearerAuth() // Para permitir o envio do token JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();