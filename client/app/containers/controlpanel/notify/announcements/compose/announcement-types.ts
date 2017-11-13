import { CPI18nService } from './../../../../../shared/services/i18n.service';

const cpI18n = new CPI18nService();

export const types = [
  {
    action: 2,
    label: cpI18n.translate('regular'),
    description: cpI18n.translate('announcements_regular_help')
  },
  {
    action: 1,
    label: cpI18n.translate('urgent'),
    description: cpI18n.translate('announcements_urgent_help'),
  },
  {
    action: 0,
    label: cpI18n.translate('emergency'),
    description: cpI18n.translate('announcements_emergency_help'),
  }
];
