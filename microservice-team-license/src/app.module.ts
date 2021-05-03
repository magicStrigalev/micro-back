import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamLicense } from './teamlicense/teamlicense.entity';
import { TeamLicenseModule } from './teamlicense/teamlicense.module';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    entities: [TeamLicense]
  }), TeamLicenseModule],
})
export class AppModule { }
