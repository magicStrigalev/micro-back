import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fingerprint } from './entities/fingerprint.entity';
import { FingerPrintService } from './services/fingerprint.service';
import { Geo } from './entities/geo.entity';
import { GeoService } from './services/geo.service';
import { Cookie } from './entities/cookie.entity';
import { CookieService } from './services/cookie.service';
import { Proxy } from './entities/proxy.entity';
import { ProxyService } from './services/proxy.service';
import { BrowserProfile } from './entities/browserprofile.entity';
import { BrowserProfileService } from './browserprofile.service';
import { ManualFingerPrint } from './entities/manualfingerprint.entity';
import { ManualFingerPrintService } from './services/manualfingerprint.service';
import { UserController } from './browserprofile.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { auth_host } from '../config';
@Module({
  imports: [
    TypeOrmModule.forFeature([Fingerprint]),
    TypeOrmModule.forFeature([Geo]),
    TypeOrmModule.forFeature([Cookie]),
    TypeOrmModule.forFeature([Proxy]),
    TypeOrmModule.forFeature([BrowserProfile]),
    TypeOrmModule.forFeature([ManualFingerPrint]),
    ClientsModule.register([
      {
        name: 'AUTH_CLIENT',
        transport: Transport.TCP,
        options: {
          host: auth_host,
          port: 4020
        }
      },
    ]),
  ],
  providers: [
    FingerPrintService,
    GeoService,
    CookieService,
    ProxyService,
    BrowserProfileService,
    ManualFingerPrintService,
    JwtAuthGuard
  ],
  controllers: [UserController],
})
export class BrowserProfileModule { }
