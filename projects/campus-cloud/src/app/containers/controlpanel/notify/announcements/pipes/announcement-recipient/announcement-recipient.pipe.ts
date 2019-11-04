import { Pipe, PipeTransform } from '@angular/core';

import { IAnnouncement } from '../../model';
import { CPI18nService } from '@campus-cloud/shared/services';

@Pipe({
  name: 'announcementRecipient'
})
export class AnnouncementRecipientPipe implements PipeTransform {
  constructor(private cpI18n: CPI18nService) {}

  transform(announcement: IAnnouncement): any {
    const { is_school_wide, list_details, user_details } = announcement;

    if (is_school_wide) {
      return this.cpI18n.translate('campus_wide');
    } else if (list_details.length) {
      return list_details[0].name;
    } else if (user_details.length) {
      const { firstname, lastname } = user_details[0];
      return `${firstname} ${lastname} (${user_details.length - 1} ${this.cpI18n.translate(
        'more'
      )})`;
    }

    return '';
  }
}
