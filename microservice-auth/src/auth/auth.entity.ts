import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, BeforeInsert, Unique } from 'typeorm';
import { hash } from 'bcrypt';
import { IsEmail, Min } from 'class-validator';
import { AuthInterface } from './auth.interface';

@Entity()
@Unique(['email'])
export class User implements AuthInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  login: string;

  @Column({ default: null, nullable: true })
  firstName: string;

  @Column({ default: null, nullable: true })
  lastName: string;

  @Column({ default: null, nullable: true })
  profession: string;

  @Column({ default: null, nullable: true })
  avatar: string;

  @Column()
  refUrl: string;

  @Column()
  telegram: string;

  @Column({ default: 0, nullable: true })
  balance: number;

  @Column({ default: null, nullable: true })
  role: string;

  @Column({ default: null, nullable: true })
  subUserId: number;

  @Column()
  @Min(8)
  password: string;

  @Column()
  @IsEmail()
  email: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: false, nullable: true })
  isEmailVerified: boolean;

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }
}