import { Injectable } from '@angular/core';

const now = new Date();
const in5Minutes = now.setUTCSeconds(now.getUTCSeconds() + 5 * 60);

@Injectable()
export class AnnouncementUtilsService {
  static readonly validTimestamp = in5Minutes;

  static isNotifyAtTimestampValid(timestamp: number) {
    return timestamp >= Math.floor(in5Minutes / 1000);
  }
}
