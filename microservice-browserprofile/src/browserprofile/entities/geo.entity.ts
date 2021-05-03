import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { GeoInterface } from '../interfaces/geo.interface';

@Entity()
export class Geo implements GeoInterface {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: null, nullable: true })
    accuracy: number;

    @Column()
    langs: string;

    @Column()
    time_zone: string;

    @Column()
    latitude: string;

    @Column()
    longitude: string;
}