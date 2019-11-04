import { Pipe, PipeTransform } from '@angular/core';

import { CPI18nService } from '@campus-cloud/shared/services';
import { AnnouncementPriority } from '../../model';
@Pipe({
  name: 'priorityToLabel'
})
export class PriorityToLabelPipe implements PipeTransform {
  constructor(private cpI18n: CPI18nService) {}

  transform(priority: AnnouncementPriority): any {
    switch (priority) {
      case AnnouncementPriority.emergency:
        return this.cpI18n.translate('emergency');
      case AnnouncementPriority.urgent:
        return this.cpI18n.translate('urgent');
      case AnnouncementPriority.regular:
        return this.cpI18n.translate('regular');
      default:
        return '';
    }
  }
}
