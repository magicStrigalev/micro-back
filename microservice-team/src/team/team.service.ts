import { Injectable, Logger, Inject, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { timeout, catchError } from 'rxjs/operators';
import { TimeoutError, throwError } from 'rxjs';
import { Repository } from 'typeorm';
import { Team } from './team.entity';
import { TeamDto } from 'src/dto/team.dto';

@Injectable()
export class TeamService {
    constructor(
        @Inject('AUTH_CLIENT')
        @Inject('TEAM_LICENSE_CLIENT')
        private readonly client: ClientProxy,
        @InjectRepository(Team)
        private readonly teamRepository: Repository<Team>
    ) { }

    async saveTeam(team: Team): Promise<TeamDto> {
        const result = await this.teamRepository.save({ ...team });
        try {
            const creatorId = await this.client.send({ role: 'user', cmd: 'get' }, +result.creatorId)
                //team.creatorId = await this.client.send({ role: 'user', cmd: 'get' }, +team.creatorId)
                .pipe(
                    timeout(5000),
                    catchError(err => {
                        if (err instanceof TimeoutError) {
                            return throwError(new RequestTimeoutException());
                        }
                        return throwError(err);
                    }))
                .toPromise();
                            
            // const subUsers = team.subUsersIds.length
            // console.log(subUsers)
            // const maxSubAccounts = teamLicense.maxSubAccounts
            // console.log(maxSubAccounts)
                const data = {
                    id: result.id,
                    name: result.name,
                    creatorId: creatorId,
                    teamLicenseId: result.teamLicenseId,
                    subUsersIds: result.subUsersIds
                }
                return data
            
        }
        catch (e) {
            Logger.log(e);
            throw e;
        }
    }

    async getTeamById(id: number): Promise<Team> {
        try {
            const result = await this.teamRepository.findOne({ where: { id } })
            //team.teamLicenseId = await this.client.send({ role: 'team_license', cmd: 'get' }, +team.teamLicenseId )
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

    async getTeamsById(creatorId: number): Promise<Team[]> {
        const results = await this.teamRepository.find({ where: { creatorId } });
        for (let result of results) {
            try {
                //team.teamLicenseId = await this.client.send({ role: 'team_license', cmd: 'get' }, +team.teamLicenseId )
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

    async getAllTeam(): Promise<Team[]> {
        try {
            return await this.teamRepository.find();
        }
        catch (e) {
            Logger.log(e);
            throw e;
        }
    }
    async updateTeamById(id: number, team: Team): Promise<any> {
        return await this.teamRepository.update(id, team);
    }

}