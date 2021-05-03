import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { CookieInterface } from '../interfaces/cookie.interface';

@Entity()
export class Cookie implements CookieInterface {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    cookie: string;
}