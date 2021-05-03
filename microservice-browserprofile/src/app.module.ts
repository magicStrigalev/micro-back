import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fingerprint } from './browserprofile/entities/fingerprint.entity';
import { Geo } from './browserprofile/entities/geo.entity';
import { Cookie } from './browserprofile/entities/cookie.entity';
import { Proxy } from './browserprofile/entities/proxy.entity';
import { BrowserProfile } from './browserprofile/entities/browserprofile.entity';
import { ManualFingerPrint } from './browserprofile/entities/manualfingerprint.entity';
import { BrowserProfileModule } from './browserprofile/browserprofile.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      entities: [
        Fingerprint,
        Geo,
        Cookie,
        Proxy,
        BrowserProfile,
        ManualFingerPrint,
      ],
    }),
    BrowserProfileModule,
  ],
})
export class AppModule {}
