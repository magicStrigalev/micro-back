import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { TeamInterface } from './team.interface';

@Entity()
export class Team implements TeamInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  creatorId: number;

  @Column()
  teamLicenseId: number;

  @Column("int", { array: true })
  subUsersIds: number[];

  @CreateDateColumn()
  createdAt: Date;
}