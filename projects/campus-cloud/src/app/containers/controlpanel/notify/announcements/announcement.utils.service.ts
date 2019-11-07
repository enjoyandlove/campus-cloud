import { Injectable } from '@angular/core';

import { IAnnouncement, notifyAtEpochNow } from './model/announcement.interface';

@Injectable()
export class AnnouncementUtilsService {
  static isNotifyAtTimestampInThePast(timestamp: number) {
    const now = new Date();
    return now.getTime() > timestamp * 1000;
  }

  static withinFiveMinutes(timestamp: number) {
    const now = new Date();

    const fiveMinutes = now.setUTCSeconds(now.getUTCSeconds() + 5 * 60);
    return fiveMinutes > timestamp * 1000 && !this.isNotifyAtTimestampInThePast(timestamp);
  }

  static isScheduledAnnouncement(announcement: IAnnouncement) {
    return announcement.notify_at_epoch !== notifyAtEpochNow;
  }
}
