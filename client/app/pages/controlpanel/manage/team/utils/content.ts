import { CP_PRIVILEGES } from '../../../../../shared/utils/privileges';

const IDs = [17, 16, 21, 15, 23, 31];

const buildContentOptions = function buildContentOptions(userPrivileges: number[]) {
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

// const buildContentOptions = function buildContentOptions(userPrivileges: number[]) {
//   let _menu = [];
//   IDs.map(id => {
//     if (userPrivileges.indexOf(id) > -1) {
//       _menu.push({
//         [id]: {
//           'label': CP_PRIVILEGES[id],
//           'read': true,
//           'write': false
//         }
//       });
//     }
//   });
//   return _menu;
// };

export const CONTENT = {
  IDs,
  createList: buildContentOptions
};

