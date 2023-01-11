import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get<ConfigService>(ConfigService);
  await app.listen(configService.get('PORT'), () => {
    process.parentPort &&
      process.parentPort.postMessage({
        type: 'SERVER_STARTED',
        message: `Server started at ${configService.get('PORT')}`,
      });
  });
}

bootstrap();
