import { Injectable } from '@angular/core';

const d = new Date();
const now = new Date(d.getTime());
const in5Minutes = d.setUTCSeconds(d.getUTCSeconds() + 5 * 60);

@Injectable()
export class AnnouncementUtilsService {
  static readonly validTimestamp = in5Minutes;

  static isNotifyAtTimestampInThePast(timestamp: number) {
    return now.getTime() > timestamp * 1000;
  }

  static withinFiveMinute(timestamp: number) {
    return timestamp * 1000 >= now.getTime() && in5Minutes > timestamp * 1000;
  }
}
