import { CPI18nService } from './../../../../../../../shared/services/i18n.service';

const cpI18n = new CPI18nService();

export const DATE_FILTER = [
  {
    'label': cpI18n.translate('events_label_upcoming_events'),
    'action': true
  },
  {
    'label': cpI18n.translate('events_label_past_events'),
    'action': false
  }
];
