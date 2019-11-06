import { Injectable } from '@angular/core';

import { IAnnouncement, notifyAtEpochNow } from './model/announcement.interface';

@Injectable()
export class AnnouncementUtilsService {
  static isNotifyAtTimestampInThePast(timestamp: number) {
    const now = new Date();
    return now.getTime() > timestamp * 1000;
  }

  static withinFiveMinute(timestamp: number) {
    const now = new Date();
    const in5Minutes = now.setUTCSeconds(now.getUTCSeconds() + 5 * 60);

    return timestamp * 1000 >= now.getTime() && in5Minutes > timestamp * 1000;
  }

  static isScheduledAnnouncement(announcement: IAnnouncement) {
    return announcement.notify_at_epoch !== notifyAtEpochNow;
  }
}
