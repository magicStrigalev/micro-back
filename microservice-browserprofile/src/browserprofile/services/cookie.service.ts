import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cookie } from '../entities/cookie.entity';

@Injectable()
export class CookieService {
    constructor(
        @InjectRepository(Cookie)
        private readonly cookieRepository: Repository<Cookie>
    ) { }

    async saveCookie(cookie: Cookie): Promise<Cookie> {
        const data = {
            id : cookie.id,
            cookie : cookie.cookie,
        }
        return await this.cookieRepository.save({ ...data });
    }

    async getCookieById(id: number): Promise<Cookie> {
        const cookie = await this.cookieRepository.findOne({ where: { id } }); 
        if (!cookie) {
            return null
        }
        return cookie
    }

    async updateCookieById(id : number, cookie: Cookie): Promise<any> {
        return await this.cookieRepository.update(id, cookie);
    }
    
}