import { CPI18nPipe } from '../../../../../shared/pipes/i18n/i18n.pipe';

export * from './services-create.component';

const i18n = new CPI18nPipe();
export const membershipTypes = [
  {
    action: true,
    label: i18n.transform('service_enabled'),
    description: i18n.transform('t_services_membership_enabled')
  },
  {
    action: false,
    label: i18n.transform('services_disabled'),
    description: i18n.transform('t_services_membership_disabled')
  }
];
