import { Injectable, Logger, Inject, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamLicense } from './teamlicense.entity';
import { TeamLicenseDto } from '../dto/teamlicense.dto';
import { ClientProxy } from '@nestjs/microservices';
import { timeout, catchError } from 'rxjs/operators';
import { TimeoutError, throwError } from 'rxjs';

@Injectable()
export class TeamLicenseService {
    constructor(
        @Inject('AUTH_CLIENT')
        private readonly client: ClientProxy,
        @InjectRepository(TeamLicense)
        private readonly teamLicenseRepository: Repository<TeamLicense>
    ) { }

    async saveTeamLicense(teamLicense: TeamLicense): Promise<TeamLicenseDto> {
        const result = await this.teamLicenseRepository.save({ ...teamLicense });
        try {
            const creatorId = await this.client.send({ role: 'user', cmd: 'get' }, +result.creatorId)
                .pipe(
                    timeout(5000),
                    catchError(err => {
                        if (err instanceof TimeoutError) {
                            return throwError(new RequestTimeoutException());
                        }
                        return throwError(err);
                    }))
                .toPromise();
            const data = {
                id: result.id,
                maxProfiles: result.maxProfiles,
                dieTo: result.dieTo,
                maxSubAccounts: result.maxSubAccounts,
                creatorId: creatorId
            }
            return data
        }
        catch (e) {
            Logger.log(e);
            throw e;
        }


    }

    async getTeamLicenseByIdWithCreatorId(id: number): Promise<TeamLicense> {
        const result = await this.teamLicenseRepository.findOne({ where: { id } })
        try {
            result.creatorId = await this.client.send({ role: 'user', cmd: 'get' }, +result.creatorId)
                .pipe(
                    timeout(5000),
                    catchError(err => {
                        if (err instanceof TimeoutError) {
                            return throwError(new RequestTimeoutException());
                        }
                        return throwError(err);
                    }))
                .toPromise();
            return result
        }
        catch (e) {
            Logger.log(e);
            throw e;
        }
    }
    async getTeamLicensesById(creatorId: number): Promise<TeamLicense[]> {
        const results = await this.teamLicenseRepository.find({ where: { creatorId } });
        for (let result of results) {
            try {
                result.creatorId = await this.client.send({ role: 'user', cmd: 'get' }, +result.creatorId)
                    .pipe(
                        timeout(5000),
                        catchError(err => {
                            if (err instanceof TimeoutError) {
                                return throwError(new RequestTimeoutException());
                            }
                            return throwError(err);
                        }))
                    .toPromise();
            }
            catch (e) {
                Logger.log(e);
                throw e;
            }
        } return results
    }
    
    async getTeamLicenseById(id: number): Promise<TeamLicense> {
        return await this.teamLicenseRepository.findOne({ where: { id } })
    }

    async updateTeamLicenseById(id: number, teamLicense: TeamLicense): Promise<any> {
        return await this.teamLicenseRepository.update(id, teamLicense);
    }

}