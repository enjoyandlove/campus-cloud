import { CPI18nService } from '../../../../../../../../shared/services';

const cpI18n = new CPI18nService();

export const permissions = [
  // {
  //   type: 1,
  //   title: 'Can View',
  //   description: 'See content created by other team members<br>'
  // },
  {
    type: 2,
    title: cpI18n.translate('admin_can_edit'),
    description: cpI18n.translate('admin_can_edit_help'),
  },
];
