import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fingerprint } from '../entities/fingerprint.entity';

@Injectable()
export class FingerPrintService {
  constructor(
    @InjectRepository(Fingerprint)
    private readonly fingerPrintRepository: Repository<Fingerprint>,
  ) { }

  async getFingerPrint(
    user_agent: string,
    platform: string,
    height: number,
    width: number,
    unmasked_render: string,
  ): Promise<Fingerprint> {
    const fingerPrint = await this.fingerPrintRepository.findOne({
      where: { user_agent, platform, height, width, unmasked_render },
    });
    if (!fingerPrint) {
      return null;
    }
    return fingerPrint;
  }

  async getFingerPrintById(id: number): Promise<Fingerprint> {
    return await this.fingerPrintRepository.findOneOrFail({ where: { id } });
  }
}
