import { Injectable, Logger, Inject, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { License } from './license.entity';
import { LicenseDto } from '../dto/license.dto';
import { ClientProxy } from '@nestjs/microservices';
import { timeout, catchError } from 'rxjs/operators';
import { TimeoutError, throwError } from 'rxjs';

@Injectable()
export class LicenseService {
    constructor(
        @Inject('AUTH_CLIENT')
        private readonly client: ClientProxy,
        @InjectRepository(License)
        private readonly licenseRepository: Repository<License>
    ) { }

    async saveLicense(license: License): Promise<LicenseDto> {
        const result = await this.licenseRepository.save({ ...license });
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
                creatorId: creatorId
            }
            return data
        }
        catch (e) {
            Logger.log(e);
            throw e;
        }


    }

    async getLicenseByIdWithCreatorId(id: number): Promise<License> {
        const result = await this.licenseRepository.findOne({ where: { id } })
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

    async getLicensesById(creatorId: number): Promise<License[]> {
        const results = await this.licenseRepository.find({ where: { creatorId } });
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

    async getLicenseById(id: number): Promise<License> {
        return await this.licenseRepository.findOne({ where: { id } })
    }

    async updateLicenseById(id: number, License: License): Promise<any> {
        return await this.licenseRepository.update(id, License);
    }

}