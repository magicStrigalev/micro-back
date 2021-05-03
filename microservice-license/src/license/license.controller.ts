import { Controller, UseGuards, Get, Post, Body, Request, Response, Put, Param, Delete, Inject, RequestTimeoutException, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { timeout, catchError } from 'rxjs/operators';
import { TimeoutError, throwError } from 'rxjs';
import { MessagePattern } from '@nestjs/microservices';
import { License } from './license.entity';
import { LicenseService } from './license.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller()
export class LicenseController {
  constructor(
    @Inject('AUTH_CLIENT')
    private readonly client: ClientProxy,
    private readonly licenseService: LicenseService,
  ) { }

  // License
  @Get('license/:id')
  @UseGuards(JwtAuthGuard)
  async getLicense(@Request() request) {
    const id = request.params.id
    return await this.licenseService.getLicenseByIdWithCreatorId(id)
  }

  @Get('license/')
  @UseGuards(JwtAuthGuard)
  async getAllLicenses(@Request() request) {
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
        return await this.licenseService.getLicensesById(result.sub)
    } catch (err) {
      Logger.error(err);
      return false;
    }
  }

  @Post('license')
  @UseGuards(JwtAuthGuard)
  async saveLicense(@Body() license: License) {
    return this.licenseService.saveLicense(license);
  }
  
  @Put('license/:id')
  @UseGuards(JwtAuthGuard)
  async updateLicense(@Param('id') id: number, @Body() license: License, @Response() response) {
    this.licenseService.updateLicenseById(id, license);
    response.json(license)
  }

  @MessagePattern({ role: 'license', cmd: 'get' })
  async getProfileById(id): Promise<License> {
    return this.licenseService.getLicenseById(id);
  }
}