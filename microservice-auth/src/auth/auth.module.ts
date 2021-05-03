import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import { jwt_secret } from '../config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './auth.entity';
import { JwtStrategy } from './jwt.strategy';
import { Ref } from './ref.entity';
/* @Module({
 imports: [
   PassportModule,
   TypeOrmModule.forFeature([User]),
   JwtModule.register({
     secret: jwt_secret,
     signOptions: { expiresIn: "1h" }
   })],
 controllers: [AuthController],
 providers: [AuthService, LocalStrategy, JwtStrategy]
})
export class AuthModule { } */

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_CLIENT',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 4030,
        },
      },
    ]),
    TypeOrmModule.forFeature([User, Ref]),
    JwtModule.register({
      secret: jwt_secret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
