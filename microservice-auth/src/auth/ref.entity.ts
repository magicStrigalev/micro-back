import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  BeforeInsert,
  Unique,
} from 'typeorm';
import { hash } from 'bcrypt';
import { IsEmail, Min } from 'class-validator';
import { AuthInterface } from './auth.interface';

@Entity()
export class Ref {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null, nullable: true })
  referalProfit: number;

  @Column({ default: null, nullable: true })
  userProfit: number;

  @Column({ default: null, nullable: true })
  conversion: number;

  @Column({ default: null, nullable: true })
  allProfit: number;

  @Column({ default: null, nullable: true })
  always: boolean;
}
