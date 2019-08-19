import { ApiType, AccessType } from '../model/api-management.interface';

export const defaultForm = {
  name: null,
  user_info: null,
  client_id: null,
  is_sandbox: null,
  push_notification: null,
  permission_data: null
};

export const filledForm = {
  client_id: 123,
  user_info: true,
  is_sandbox: true,
  push_notification: true,
  name: 'Printer network',
  permission_data: { [ApiType.user]: AccessType.write }
};

export const mockAPIData = [
  {
    name: 'Printer network',
    date_created: 1564588800,
    date_last_modified: 1564588800,
    id: 'hj263749hgd76651hjd768wk',
    token: 'live_qB23EwdDrFtdfG4G5Re0LlsaqWe34R5f',
    permission_data: { [ApiType.user]: AccessType.write }
  },
  {
    name: 'Computer room',
    date_created: 1564588800,
    date_last_modified: 1564588800,
    id: 'hj263749hgd76651hjd768wl',
    token: 'live_qB23EwdDrFtdfG4G5Re0LlsaqWe34R5g',
    permission_data: { [ApiType.user]: AccessType.write }
  },
  {
    name: 'Library',
    date_created: 1564588800,
    date_last_modified: 1564588800,
    id: 'hj263749hgd76651hjd768wm',
    token: 'test_qB23EwdDrFtdfG4G5Re0LlsaqWe34R5h',
    permission_data: { [ApiType.user]: AccessType.write }
  }
];
