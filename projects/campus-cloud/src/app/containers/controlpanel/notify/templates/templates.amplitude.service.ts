import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { AnnouncementAmplitudeService } from './../announcements/announcement.amplitude.service';

export class TemplatesAmplitudeService extends AnnouncementAmplitudeService {
  constructor() {
    super();
  }

  static getCommunicationType() {
    return amplitudeEvents.COMMUNICATION_TYPE_SENT_NOW;
  }
}
