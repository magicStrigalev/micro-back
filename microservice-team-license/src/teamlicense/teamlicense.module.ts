import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamLicense } from './teamlicense.entity';
import { TeamLicenseService } from './teamlicense.service';
import { TeamLicenseController } from './teamlicense.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmModule.forFeature([TeamLicense]),
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
    TeamLicenseService,
  ],
  controllers: [TeamLicenseController],
})
export class TeamLicenseModule { }