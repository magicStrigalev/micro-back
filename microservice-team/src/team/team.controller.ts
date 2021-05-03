import { Controller, UseGuards, Get, Post, Body, Request, Response, Put, Param, Delete, Inject, RequestTimeoutException, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { timeout, catchError } from 'rxjs/operators';
import { TimeoutError, throwError } from 'rxjs';
import { MessagePattern } from '@nestjs/microservices';
import { Team } from './team.entity';
import { TeamService } from './team.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller()
export class TeamController {
  constructor(
    @Inject('AUTH_CLIENT')
    private readonly client: ClientProxy,
    private readonly teamService: TeamService,
  ) { }

  // Team
  @Get('team/:id')
  @UseGuards(JwtAuthGuard)
  async getTeam(@Request() request) {
    const id = request.params.id
    return await this.teamService.getTeamById(id)
  }

  @Get('team')
  @UseGuards(JwtAuthGuard)
  async getAllTeam(@Request() request) {
    try {
      const result = await this.client.send(
        { role: 'auth', cmd: 'check' },
        { jwt: request.headers['authorization']?.split(' ')[1] })
        .pipe(
          timeout(5000),
          catchError(err => {
            if (err instanceof TimeoutError) {
              return throwError(new RequestTimeoutException());
            }
            return throwError(err);
          }))
        .toPromise();
      return await this.teamService.getTeamsById(result.sub);
    } catch (err) {
      Logger.error(err);
      return false;
    }
  }

  @Post('team')
  @UseGuards(JwtAuthGuard)
  async saveBrowserProfile(@Body() team: Team) {
    return this.teamService.saveTeam(team);
  }

  @Put('team/:id')
  @UseGuards(JwtAuthGuard)
  async updateTeam(@Param('id') id: number, @Body() team: Team, @Response() response) {
    this.teamService.updateTeamById(id, team);
    response.json(team)
  }

}