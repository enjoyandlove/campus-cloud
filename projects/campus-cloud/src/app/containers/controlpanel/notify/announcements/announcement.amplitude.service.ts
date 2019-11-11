import { notifyAtEpochNow } from './model/announcement.interface';
import { IAnnouncement, AnnouncementPriority } from './model';

export class AnnouncementAmplitudeService {
  static getAmplitudeProperties(announcement: IAnnouncement) {
    return {
      announcement_id: announcement.id,
      host_type: announcement.store_id,
      audience_type: this.getAudienceType(announcement.store_id),
      announcement_type: this.getAnnouncementType(announcement.priority),
      communication_type: this.getCommunicationType(announcement.notify_at_epoch)
    };
  }

  static getAnnouncementType(priority: AnnouncementPriority) {
    switch (priority) {
      case AnnouncementPriority.emergency:
        return 'Emergency';
      case AnnouncementPriority.urgent:
        return 'Urgent';
      default:
        return 'Regular';
    }
  }

  static getCommunicationType(notifyAtEpoch: number) {
    return notifyAtEpoch === notifyAtEpochNow ? 'Sent Now' : 'Scheduled';
  }

  static getAudienceType(storeID: number) {
    return storeID;
  }
}
