import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { SocketClientProvider } from './socket-client/socket-client.provider';
import { SocketClientStrategy } from './socket-client/socket-client.strategy';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get<ConfigService>(ConfigService);

  // sockets client
  const socketIoClientProvider =
    app.get<SocketClientProvider>(SocketClientProvider);
  app.connectMicroservice<MicroserviceOptions>({
    strategy: new SocketClientStrategy(socketIoClientProvider.getSocket()),
  });
  await app.startAllMicroservices();

  await app.listen(configService.get('PORT'), () => {
    process.parentPort &&
      process.parentPort.postMessage({
        type: 'SERVER_STARTED',
        message: `Server started at ${configService.get('PORT')}`,
      });
  });
}

bootstrap();
