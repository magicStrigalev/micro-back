import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './team.entity';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmModule.forFeature([Team]),
    ClientsModule.register([{
      name: 'AUTH_CLIENT',
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 4020
      }
    },
    {
      name: 'TEAM_LICENSE_CLIENT',
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 4030
      }
    },
  ])
  ],
  providers: [
    TeamService,
  ],
  controllers: [TeamController],
})
export class TeamModule { }