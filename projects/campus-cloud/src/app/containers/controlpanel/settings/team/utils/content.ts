import { CP_PRIVILEGES } from '../../../../../shared/constants';

const IDs = [17, 16, 21, 15, 23, 31];

function buildContentOptions(userPrivileges: number[]) {
  const _menu = [];
  IDs.map((id) => {
    if (userPrivileges.indexOf(id) > -1) {
      _menu.push({
        [id]: CP_PRIVILEGES[id]
      });
    }
  });
  return _menu;
}

export const CONTENT = {
  IDs,
  createList: buildContentOptions
};
