import { ManualFingerPrintService } from './services/manualfingerprint.service';
import { GeoService } from './services/geo.service';
import { FingerPrintService } from './services/fingerprint.service';
import { ProxyService } from './services/proxy.service';
import { CookieService } from './services/cookie.service';
import { Injectable, Logger, Inject, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { timeout, catchError } from 'rxjs/operators';
import { TimeoutError, throwError } from 'rxjs';
import { Repository } from 'typeorm';
import { BrowserProfile } from './entities/browserprofile.entity';

@Injectable()
export class BrowserProfileService {
  constructor(
    @Inject('AUTH_CLIENT')
    private readonly client: ClientProxy,
    @InjectRepository(BrowserProfile)
    private readonly browserProfileRepository: Repository<BrowserProfile>,
    private readonly cookieService: CookieService,
    private readonly proxyService: ProxyService,
    private readonly fingerPrintService: FingerPrintService,
    private readonly geoService: GeoService,
    private readonly manualFingerPrintService: ManualFingerPrintService,
  ) { }

  async saveBrowserProfile(browserProfile: BrowserProfile): Promise<any> {
    try {
      const saveBrowserProfile = await this.browserProfileRepository.save({
        ...browserProfile,
      });
      const cookie = await this.cookieService.getCookieById(
        saveBrowserProfile.cookie_id,
      );
      const proxy = await this.proxyService.getProxyById(
        saveBrowserProfile.proxy_id,
      );
      const fingerPrint = await this.fingerPrintService.getFingerPrintById(
        saveBrowserProfile.fingerprint_id,
      );
      const manualFingerPrint = await this.manualFingerPrintService.getManualFingerPrintById(
        saveBrowserProfile.manual_fingerprint_id,
      );
      const geo = await this.geoService.getGeoById(saveBrowserProfile.geo_id);
      const creator_id = await this.client.send({ role: 'user', cmd: 'get' }, +browserProfile.creator_id)
        //team.creatorId = await this.client.send({ role: 'user', cmd: 'get' }, +team.creatorId)
        .pipe(
          timeout(5000),
          catchError(err => {
            if (err instanceof TimeoutError) {
              return throwError(new RequestTimeoutException());
            }
            return throwError(err);
          }))
        .toPromise();
      const data = {
        id: browserProfile.id,
        name: browserProfile.name,
        folder: browserProfile.folder,
        fingerprint_id: fingerPrint || null,
        cookie: cookie || null,
        proxy: proxy || null,
        manualFingerPrint: manualFingerPrint || null,
        geo: geo,
        removed: browserProfile.removed,
        start_url: browserProfile.start_url,
        creator_id: creator_id,
        favorite: browserProfile.favorite,
      };
      return data;
    }
    catch (e) {
      Logger.log(e);
      throw e;
    }
  }

  async getBrowserProfileById(id: number): Promise<any> {
    try {
      const browserProfile = await this.browserProfileRepository.findOneOrFail({
        where: { id },
      });
      const cookie = await this.cookieService.getCookieById(
        browserProfile.cookie_id,
      );
      const proxy = await this.proxyService.getProxyById(
        browserProfile.proxy_id,
      );
      const fingerPrint = await this.fingerPrintService.getFingerPrintById(
        browserProfile.fingerprint_id,
      );
      const manualFingerPrint = await this.manualFingerPrintService.getManualFingerPrintById(
        browserProfile.manual_fingerprint_id,
      );
      const geo = await this.geoService.getGeoById(browserProfile.geo_id);
      const creator_id = await this.client.send({ role: 'user', cmd: 'get' }, +browserProfile.creator_id)
        //team.creatorId = await this.client.send({ role: 'user', cmd: 'get' }, +team.creatorId)
        .pipe(
          timeout(5000),
          catchError(err => {
            if (err instanceof TimeoutError) {
              return throwError(new RequestTimeoutException());
            }
            return throwError(err);
          }))
        .toPromise();
      const data = {
        id: browserProfile.id,
        name: browserProfile.name,
        folder: browserProfile.folder,
        fingerprint_id: fingerPrint || null,
        cookie: cookie || null,
        proxy: proxy || null,
        manualFingerPrint: manualFingerPrint || null,
        geo: geo,
        removed: browserProfile.removed,
        start_url: browserProfile.start_url,
        creator_id: creator_id,
        favorite: browserProfile.favorite,
      };
      return data;
    }
    catch (e) {
      Logger.log(e);
      throw e;
    }
  }

  async getBrowserProfiles(creator_id: number, size : number, page : number): Promise<any[]> {
    const browserProfiles = await this.getAllCreatorBrowserProfiles(creator_id, size, page)
    for (let browserProfile of browserProfiles) {

      browserProfile.cookie_id = await this.cookieService.getCookieById(
        browserProfile.cookie_id,
      );
      browserProfile.proxy_id = await this.proxyService.getProxyById(
        browserProfile.proxy_id,
      );
      browserProfile.fingerPrint_id = await this.fingerPrintService.getFingerPrintById(
        browserProfile.fingerprint_id,
      );
      browserProfile.manualFingerPrint_id = await this.manualFingerPrintService.getManualFingerPrintById(
        browserProfile.manual_fingerprint_id,
      );
      browserProfile.geo_id = await this.geoService.getGeoById(browserProfile.geo_id);

    }
    return browserProfiles;

  }

  async getAllUserBrowserProfiles(user_id: string, id: string): Promise<any> {
    const browserProfile = await this.browserProfileRepository.find({
      where: { user_id },
    });
    return browserProfile;
  }

  async getAllCreatorBrowserProfiles(creator_id: number, size : number, page : number): Promise<any> {
    const take = size
    const skip = page - 1
    const browserProfile = await this.browserProfileRepository.find({
      where: { creator_id },
      order: { favorite: "DESC" },
      take: take,
      skip : skip,
    });
    return browserProfile;
  }

  async getAllUserBrowserProfilesInFolder(
    user_id: string,
    folder: string,
  ): Promise<any> {
    const browserProfile = await this.browserProfileRepository.find({
      where: { user_id, folder },
    });
    return browserProfile;
  }

  async getAllUserFolders(user_id: string): Promise<any> {
    const folders = await this.browserProfileRepository.find({
      select: ['folder'],
      where: {
        user_id,
      },
    });
    return folders;
  }

  async deleteBrowserProfile(id: number): Promise<any> {
    return this.browserProfileRepository.delete(id);
  }
}
