import { Injectable } from '@angular/core';

import { IAnnouncement, notifyAtEpochNow } from './model/announcement.interface';
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
    const _now = new Date();
    const _in5Minutes = _now.setUTCSeconds(_now.getUTCSeconds() + 5 * 60);

    return timestamp * 1000 >= _now.getTime() && _in5Minutes > timestamp * 1000;
  }

  static isScheduledAnnouncement(announcement: IAnnouncement) {
    return announcement.notify_at_epoch !== notifyAtEpochNow;
  }
}
