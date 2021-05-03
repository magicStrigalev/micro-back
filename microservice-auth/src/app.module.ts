import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/auth.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ref } from './auth/ref.entity';

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
      entities: [User, Ref],
    }),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
