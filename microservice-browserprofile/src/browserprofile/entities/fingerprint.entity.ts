import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  BeforeInsert,
} from 'typeorm';

@Entity()
@Unique(['hash'])
export class Fingerprint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  maxTouchPoints: number;

  @Column()
  browser: string;

  @Column()
  os: string;

  @Column()
  height: number;

  @Column()
  width: number;

  @Column()
  userAgent: string;

  @Column()
  userAgentHeader: string;

  @Column()
  VENDOR: string;

  @Column()
  RENDERER: string;

  @Column()
  audiooutput: number;

  @Column()
  videoinput: number;

  @Column()
  audioinput: number;

  @Column()
  fonts: string;

  @Column()
  hardwareConcurrency: number;

  @Column()
  deviceMemory: number;

  @Column()
  language: string;

  @Column()
  languages: string;

  @Column()
  acceptLanguage: string;

  @Column()
  MAX_VERTEX_ATTRIBS: number;

  @Column()
  MAX_VERTEX_UNIFORM_VECTORS: number;

  @Column()
  MAX_VERTEX_TEXTURE_IMAGE_UNITS: number;

  @Column()
  MAX_VARYING_VECTORS: number;

  @Column()
  MAX_RENDERBUFFER_SIZE: number;

  @Column()
  MAX_TEXTURE_SIZE: number;

  @Column()
  MAX_TEXTURE_MAX_ANISOTROPY_EXT: number;

  @Column()
  EXTENNSION_ONE: string;

  @Column()
  EXTENNSION_TWO: string;

  @Column()
  hash: string;
}
