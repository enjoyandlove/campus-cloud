import { CPI18nService } from '../../../../../../../../shared/services';

const cpI18n = new CPI18nService();

export interface IPermission {
  icon: string;
  type: number;
  title: string;
  description: string;
}

export enum permissionType {
  read = 1,
  write = 2
}

export enum permissionIcon {
  read = 'lock',
  write = 'mode_edit'
}

export const permissions: Array<IPermission> = [
  {
    icon: permissionIcon.write,
    type: permissionType.write,
    title: cpI18n.translate('admin_can_edit'),
    description: cpI18n.translate('admin_can_edit_help')
  }
];

export const clubOnlyPermissions: Array<IPermission> = [
  ...permissions,
  {
    icon: permissionIcon.read,
    type: permissionType.read,
    title: cpI18n.translate('admin_can_read'),
    description: cpI18n.translate('admin_can_read_help')
  }
];
