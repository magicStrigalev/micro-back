import { Controller, UseGuards, Get, Post, Body, Request, Response, Put, Param, Delete, Inject, RequestTimeoutException, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { timeout, catchError } from 'rxjs/operators';
import { TimeoutError, throwError } from 'rxjs';
import { MessagePattern } from '@nestjs/microservices';
import { TeamLicense } from './teamlicense.entity';
import { TeamLicenseService } from './teamlicense.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller()
export class TeamLicenseController {
  constructor(
    @Inject('AUTH_CLIENT')
    private readonly client: ClientProxy,
    private readonly teamLicenseService: TeamLicenseService,
  ) { }

  // TeamLicense
  @Get('teamlicense/:id')
  @UseGuards(JwtAuthGuard)
  async getTeamLicenseById(@Request() request) {
    const id = request.params.id
    return await this.teamLicenseService.getTeamLicensesById(id);
  }

  @Get('teamlicense/')
  @UseGuards(JwtAuthGuard)
  async getTeamLicense(@Request() request) {
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
        return await this.teamLicenseService.getTeamLicensesById(result.sub);
    } catch (err) {
      Logger.error(err);
      return false;
    }
  }
  
  @Post('teamlicense')
  @UseGuards(JwtAuthGuard)
  async saveTeamLicense(@Body() teamLicense: TeamLicense) {
    return this.teamLicenseService.saveTeamLicense(teamLicense);
  }
  
  @Put('teamlicense/:id')
  @UseGuards(JwtAuthGuard)
  async updateTeamLicense(@Param('id') id: number, @Body() teamLicense: TeamLicense, @Response() response) {
    this.teamLicenseService.updateTeamLicenseById(id, teamLicense);
    response.json(teamLicense)
  }

  @MessagePattern({ role: 'team_license', cmd: 'get' })
  async getProfileById(id): Promise<TeamLicense> {
    return this.teamLicenseService.getTeamLicenseById(id);
  }
}