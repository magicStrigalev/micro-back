import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Geo } from '../entities/geo.entity';
import { withLatestFrom } from 'rxjs/operators';

@Injectable()
export class GeoService {
    constructor(
        @InjectRepository(Geo)
        private readonly geoRepository: Repository<Geo>
    ) { }

    async saveGeo(geo: Geo): Promise<Geo> {
        const data = {
            id: geo.id,
            accuracy: geo.accuracy,
            langs: geo.langs,
            time_zone: geo.time_zone,
            latitude: geo.latitude,
            longitude: geo.longitude,
        }
        return await this.geoRepository.save({ ...data });
    }

    async updateGeoById(id: number, geo: Geo): Promise<any> {
        return await this.geoRepository.update(id, geo);
    }

    async getGeoById(id: number): Promise<Geo> {
        const geo = await this.geoRepository.findOne({ where: { id } });
        if (!geo) {
            return null
        }
        return geo
    }

    async genGeo(): Promise<Geo> {
        const fetch = require('node-fetch');
        const url = 'http://ipwhois.app/json/'
        const response = await fetch(url);

        const json = await response.json();
        const data = {
            accuracy: null,
            langs: json.country_code,
            time_zone: json.timezone_gmt,
            latitude: json.latitude,
            longitude: json.longitude
        }
        const result = await this.geoRepository.save(data);
        return result;
    }


}