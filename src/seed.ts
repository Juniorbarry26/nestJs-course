import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeedingService } from './database/seeding/seeding.service';

async function bootstrap() {
  // Create application context (no HTTP server)
  const app = await NestFactory.createApplicationContext(AppModule);

  // Get the SeedingService
  const seeder = app.get(SeedingService);

  try {
    await seeder.seed();
  } catch (err) {
    console.error(err);
  } finally {
    await app.close();
  }
}

bootstrap();
