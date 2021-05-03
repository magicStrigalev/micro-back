import { Injectable, Logger, Ip } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proxy } from '../entities/proxy.entity';

@Injectable()
export class ProxyService {
    constructor(
        @InjectRepository(Proxy)
        private readonly proxyRepository: Repository<Proxy>
    ) { }

    async saveProxy(proxy: Proxy): Promise<Proxy> {
        const data = {
            id: proxy.id,
            creator_id : proxy.creator_id,
            type: proxy.type,
            ip: proxy.ip,
            port: proxy.port,
            proxy_login: proxy.proxy_login,
            proxy_password: proxy.proxy_password,
        }
        return await this.proxyRepository.save({ ...data });
    }

    async getProxyById(id: number): Promise<Proxy> {
        const proxy = await this.proxyRepository.findOne({ where: { id } });
        if (!proxy) {
            return null
        }
        return proxy
    }

    async updateProxyById(id: number, proxy: Proxy): Promise<any> {
        return await this.proxyRepository.update(id, proxy);
    }
}