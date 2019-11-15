import { IAnnouncement, AnnouncementPriority } from './model';
import { notifyAtEpochNow } from './model/announcement.interface';

export class AnnouncementAmplitudeService {
  static getAmplitudeProperties(announcement: IAnnouncement, announcementId?: number) {
    const required = {
      audience_type: this.getAudienceType(announcement),
      announcement_type: this.getAnnouncementType(announcement.priority),
      communication_type: this.getCommunicationType(announcement.notify_at_epoch)
    };

    if (announcementId) {
      return {
        ...required,
        announcement_id: announcementId
      };
    }
    return required;
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

  static getCommunicationType(notifyAtEpoch: number): string {
    return notifyAtEpoch === notifyAtEpochNow ? 'Sent Now' : 'Scheduled';
  }

  static getAudienceType(announcement: IAnnouncement) {
    if (announcement.is_school_wide) {
      return 'Campus-Wide';
    }

    if (
      ('list_ids' in announcement && (announcement as any).list_ids.length) ||
      ('list_details' in announcement && announcement.list_details.length)
    ) {
      return 'Audience';
    }

    if (
      ('user_details' in announcement && (announcement as any).user_details.length) ||
      ('user_ids' in announcement && (announcement as any).user_ids.length)
    ) {
      return 'Audience';
    }

    return '';
  }
}
