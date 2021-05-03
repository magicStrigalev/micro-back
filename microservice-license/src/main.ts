import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { license_host } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: license_host,
      port: 4050
    }
  });

  await app.startAllMicroservicesAsync();
  await app.listen(3050);
  Logger.log('License microservice running');
}
bootstrap();
