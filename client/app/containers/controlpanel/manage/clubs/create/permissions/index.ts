import { ClubStatus } from '../../club.status';

import { CPI18nPipe } from './../../../../../../shared/pipes/i18n/i18n.pipe';

const i18n = new CPI18nPipe();

export const statusTypes = [
  {
    action: ClubStatus.active,
    label: i18n.transform('club_status_active'),
    description: i18n.transform('clubs_status_active')
  },
  {
    action: ClubStatus.inactive,
    label: i18n.transform('club_status_inactive'),
    description: i18n.transform('clubs_status_inactive')
  },
  {
    action: ClubStatus.pending,
    label: i18n.transform('club_status_pending'),
    description: i18n.transform('clubs_status_pending')
  }
];

export const membershipTypes = [
  {
    action: true,
    label: i18n.transform('club_membership_enabled_title'),
    description: i18n.transform('clubs_membership_enabled')
  },
  {
    action: false,
    label: i18n.transform('club_membership_disabled_title'),
    description: i18n.transform('clubs_membership_disabled')
  }
];
