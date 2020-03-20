import { IAnnouncement, AnnouncementPriority } from './model';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { notifyAtEpochNow } from './model/announcement.interface';
import { CPAmplitudeService } from '@campus-cloud/shared/services';

const listTypeMap = {
  0: amplitudeEvents.COMMUNICATION_AUDIENCE_TYPE_AUDIENCE,
  1: amplitudeEvents.COMMUNICATION_AUDIENCE_TYPE_AUDIENCE,
  2: amplitudeEvents.COMMUNICATION_AUDIENCE_TYPE_EXPERIENCE
};

export class AnnouncementAmplitudeService {
  static getAmplitudeProperties(announcement: IAnnouncement, announcementId?: number) {
    const required = {
      audience_type: this.getAudienceType(announcement),
      announcement_type: this.getAnnouncementType(announcement.priority),
      communication_type: this.getCommunicationType(announcement.notify_at_epoch),
      host_type: CPAmplitudeService.storeCategoryIdToAmplitudeName(
        announcement['store_category_id']
      )
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
        return amplitudeEvents.ANNOUNCEMENT_TYPE_EMERGENCY;
      case AnnouncementPriority.urgent:
        return amplitudeEvents.ANNOUNCEMENT_TYPE_URGENT;
      default:
        return amplitudeEvents.ANNOUNCEMENT_TYPE_REGULAR;
    }
  }

  static getCommunicationType(notifyAtEpoch: number): string {
    return notifyAtEpoch === notifyAtEpochNow
      ? amplitudeEvents.COMMUNICATION_TYPE_SENT_NOW
      : amplitudeEvents.COMMUNICATION_TYPE_SCHEDULED;
  }

  static getAudienceType(announcement: IAnnouncement) {
    if (announcement.is_school_wide) {
      return amplitudeEvents.COMMUNICATION_AUDIENCE_TYPE_CAMPUS_WIDE;
    }

    if ('list_ids' in announcement && (announcement as any).list_ids.length) {
      return amplitudeEvents.COMMUNICATION_AUDIENCE_TYPE_AUDIENCE;
    }

    if (
      'list_details' in announcement &&
      announcement.list_details.length &&
      announcement.list_details[0].type in listTypeMap
    ) {
      return listTypeMap[announcement.list_details[0].type];
    }

    if (
      ('user_details' in announcement && (announcement as any).user_details.length) ||
      ('user_ids' in announcement && (announcement as any).user_ids.length)
    ) {
      return amplitudeEvents.CUSTOM_AUDIENCE;
    }

    if ('filters' in announcement && (announcement as any).filters.length) {
      return amplitudeEvents.DYNAMIC_AUDIENCE;
    }

    if ('persona_id' in announcement) {
      return amplitudeEvents.COMMUNICATION_AUDIENCE_TYPE_EXPERIENCE;
    }

    return '';
  }
}
