import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BrowserProfileInterface } from '../interfaces/browserprofile.interface';

@Entity()
export class BrowserProfile implements BrowserProfileInterface {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    folder: string;

    @Column()
    fingerprint_id: number;

    @Column({ default: null, nullable: true })
    cookie_id: number;

    @Column({ default: null, nullable: true })
    proxy_id: number;

    @Column({ default: null, nullable: true })
    manual_fingerprint_id: number;

    @Column()
    geo_id: number;

    @Column()
    removed: boolean;

    @Column()
    start_url: string;

    @Column()
    creator_id: number;

    @Column({ default: false, nullable: true })
    favorite: boolean;
}