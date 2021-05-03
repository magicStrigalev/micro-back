import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { License } from './license.entity';
import { LicenseService } from './license.service';
import { LicenseController } from './license.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmModule.forFeature([License]),
    ClientsModule.register([{
      name: 'AUTH_CLIENT',
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 4020
      }
    }])
  ],
  providers: [
    LicenseService,
  ],
  controllers: [LicenseController],
})
export class LicenseModule { }