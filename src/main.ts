import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('APP_PORT') ?? 3000; // fallback to 3000

  const config = new DocumentBuilder()
    .setTitle('The Conrod shop')
    .setDescription('Documentation for the shop API')
    .addBearerAuth()
    .addSecurityRequirements('bearer')
    .setVersion('1.0')
    .build();
  const documentFcatory = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('conrod-api-docs', app, documentFcatory);

  await app.listen(port);
}
void bootstrap();
