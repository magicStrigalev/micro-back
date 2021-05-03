import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { browser_profile_host } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: browser_profile_host,
      port: 4010
    }
  });

  await app.startAllMicroservicesAsync();
  await app.listen(3010);
  Logger.log('Browser Profile microservice running');
}
bootstrap();
