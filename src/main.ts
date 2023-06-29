import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const origins = ['http://localhost:4200'];

  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: origins });
  await app.listen(3000);
}
bootstrap();
