export interface BrowserProfileInterface {
  id: number;
  name: string;
  folder: string;
  fingerprint_id: number;
  cookie_id: number;
  proxy_id: number;
  manual_fingerprint_id: number;
  geo_id: number;
  removed: boolean;
  start_url: string;
  creator_id: number;
  favorite : boolean;
}
