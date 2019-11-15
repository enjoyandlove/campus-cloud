import { AnnouncementAmplitudeService } from './../announcements/announcement.amplitude.service';

export class TemplatesAmplitudeService extends AnnouncementAmplitudeService {
  constructor() {
    super();
  }

  static getCommunicationType() {
    return 'Sent Now';
  }
}
