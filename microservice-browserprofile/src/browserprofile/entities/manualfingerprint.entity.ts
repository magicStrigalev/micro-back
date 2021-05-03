import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, BeforeInsert, Unique } from 'typeorm';
import { ManualFingerPrintInterface } from '../interfaces/manualfingerprint.interface';

@Entity()
export class ManualFingerPrint implements ManualFingerPrintInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_agent: string;

  @Column()
  platform: string;

  @Column()
  device_memory: number;

  @Column()
  hardware_concurrency: number;

  @Column()
  height: number;

  @Column()
  width: number;

  @Column()
  unmasked_vendor: string;

  @Column()
  unmasked_render: string;
}