import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ManualFingerPrint } from '../entities/manualfingerprint.entity';
import { rejects } from 'assert';

@Injectable()
export class ManualFingerPrintService {
  constructor(
    @InjectRepository(ManualFingerPrint)
    private readonly manualFingerPrintRepository: Repository<ManualFingerPrint>
  ) { }

  async getManualFingerPrint(user_agent: string, platform: string, height: number, width: number, unmasked_render: string): Promise<ManualFingerPrint> {
    return await this.manualFingerPrintRepository.findOneOrFail({ where: { user_agent, platform, height, width, unmasked_render } });
  }

  async getManualFingerPrintById(id: number): Promise<ManualFingerPrint> {
    const manualFingerPrint = await this.manualFingerPrintRepository.findOne({ where: { id } });
    if (!manualFingerPrint) {
      return null
    }
    return manualFingerPrint
  }

  async saveManualFingerPrint(manualFingerPrint: ManualFingerPrint): Promise<ManualFingerPrint> {
    const data = {
      user_agent: manualFingerPrint.user_agent,
      platform: manualFingerPrint.platform,
      device_memory: manualFingerPrint.device_memory,
      hardware_concurrency: manualFingerPrint.hardware_concurrency,
      height: manualFingerPrint.height,
      width: manualFingerPrint.width,
      unmasked_vendor: manualFingerPrint.unmasked_vendor,
      unmasked_render: manualFingerPrint.unmasked_render,
    }
    return await this.manualFingerPrintRepository.save({ ...data });
  }

  async updateManualFingerPrintById(id: number, manualFingerPrint: ManualFingerPrint): Promise<any> {
    return await this.manualFingerPrintRepository.update(id, manualFingerPrint);
  }

}