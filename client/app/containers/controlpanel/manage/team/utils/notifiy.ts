import { CP_PRIVILEGES } from '../../../../../shared/utils/privileges';
const IDs = [32, 12];

const buildNotifyOptions = function buildNotifyOptions(userPrivileges: number[]) {
  let _menu = [];
  IDs.map(id => {
    if (userPrivileges.indexOf(id) > -1) {
      _menu.push({
        [id]: CP_PRIVILEGES[id]
      });
    }
  });
  return _menu;
};

export const NOTIFY = {
  IDs,
  createList: buildNotifyOptions
};

