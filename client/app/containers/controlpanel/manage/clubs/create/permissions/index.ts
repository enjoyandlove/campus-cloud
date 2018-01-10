import { ClubStatus } from '../../club.status';

import { CPI18nPipe } from './../../../../../../shared/pipes/i18n/i18n.pipe';

const i18n = new CPI18nPipe();

export const statusTypes = [
  {
    action: ClubStatus.active,
    label: 'Active',
    description: i18n.transform('clubs_status_active'),
  },
  {
    action: ClubStatus.inactive,
    label: 'Inactive',
    description: i18n.transform('clubs_status_inactive'),
  },
  {
    action: ClubStatus.pending,
    label: 'Pending',
    description: i18n.transform('clubs_status_pending'),
  },
];

export const membershipTypes = [
  {
    action: true,
    label: 'Enabled',
    description: i18n.transform('clubs_membership_enabled'),
  },
  {
    action: false,
    label: 'Disabled',
    description: i18n.transform('clubs_membership_disabled'),
  },
];
