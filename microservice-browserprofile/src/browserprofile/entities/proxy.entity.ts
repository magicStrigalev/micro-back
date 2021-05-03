import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ProxyInterface } from '../interfaces/proxy.interface';

@Entity()
export class Proxy implements ProxyInterface {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: string;

    @Column()
    ip: string;

    @Column()
    port: number;
    
    @Column()
    creator_id: number;

    @Column({ default: null, nullable: true })
    proxy_login: string;

    @Column({ default: null, nullable: true })
    proxy_password: string;
}