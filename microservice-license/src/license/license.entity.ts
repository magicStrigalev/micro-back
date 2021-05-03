import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { LicenseInterface } from './license.interface';

@Entity()
export class License implements LicenseInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  maxProfiles: number;

  @Column()
  dieTo: string;

  @Column()
  creatorId: number;

  @CreateDateColumn()
  createdAt: Date;
}