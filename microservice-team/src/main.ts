import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { team_host } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: team_host,
      port: 4040
    }
  });

  await app.startAllMicroservicesAsync();
  await app.listen(3040);
  Logger.log('Team microservice running');
}
bootstrap();
