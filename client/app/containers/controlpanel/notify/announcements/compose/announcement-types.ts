import { CPI18nService } from '@shared/services';
import { AnnouncementPriority } from '../announcements.interface';

const cpI18n = new CPI18nService();

export const types = [
  {
    action: AnnouncementPriority.regular,
    disabled: false,
    label: cpI18n.translate('regular'),
    description: cpI18n.translate('announcements_regular_help')
  },
  {
    action: AnnouncementPriority.urgent,
    disabled: false,
    label: cpI18n.translate('urgent'),
    description: cpI18n.translate('announcements_urgent_help')
  },
  {
    action: AnnouncementPriority.emergency,
    disabled: true,
    label: cpI18n.translate('emergency'),
    description: cpI18n.translate('announcements_emergency_help')
  }
];
