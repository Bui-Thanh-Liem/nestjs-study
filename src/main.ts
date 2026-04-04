import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppLogger } from './logger/app.logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new AppLogger(),
  });
  app.setGlobalPrefix('api/v1');
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
