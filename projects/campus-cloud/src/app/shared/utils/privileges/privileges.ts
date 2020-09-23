import { get as _get, isEmpty } from 'lodash';
import { CP_PRIVILEGES_MAP } from '@campus-cloud/shared/constants';

const accountLevelEmpty = (user) => {
  const accountLevel = _get(user, 'account_level_privileges', []);

  return isEmpty(accountLevel);
};

const schoolLevelEmpty = (user) => {
  const schoolLevel = _get(user, 'school_level_privileges', []);

  return isEmpty(schoolLevel);
};

const clientLevelEmpty = (user) => {
  const clientLevel = _get(user, 'client_level_privileges', []);

  return isEmpty(clientLevel);
};

export const accountsToStoreMap = (accountsMap: Array<number> = [], accountPrivileges) => {
  const accounts = {};

  accountsMap.map((storeId) => {
    if (storeId in accountPrivileges) {
      accounts[storeId] = accountPrivileges[storeId];
    }
  });

  return accounts;
};

export const canStoreReadAndWriteResource = (
  session: Map<any, any>,
  storeId: number,
  privilegeType: number
): boolean => {
  const accountPrivileges = session.get('user').account_level_privileges;

  const write = _get(accountPrivileges, [storeId, privilegeType, 'w'], false);
  const read = _get(accountPrivileges, [storeId, privilegeType, 'r'], false);

  return write && read;
};

export const canStoreReadResource = (
  session: Map<any, any>,
  storeId: number,
  privilegeType: number
) => {
  const accountPrivileges = session.get('user').account_level_privileges;

  return _get(accountPrivileges, [storeId, privilegeType, 'r'], false);
};

export const canAccountLevelReadResource = (session: Map<any, any>, privilegeType: number) => {
  let hasAccountAccess = false;

  if (accountLevelEmpty(session.get('user'))) {
    return false;
  }

  try {
    session.get('user').account_mapping[session.get('school').id].forEach((store) => {
      Object.keys(session.get('user').account_level_privileges[store]).forEach((privilege) => {
        if (privilegeType === +privilege) {
          hasAccountAccess = true;
        }
      });
    });
  } catch (error) {
    return false;
  }

  return hasAccountAccess;
};

export const canAccountLevelWriteResource = (session: Map<any, any>, privilegeType: number) => {
  let hasAccountAccess = false;

  if (accountLevelEmpty(session.get('user'))) {
    return false;
  }

  try {
    session.get('user').account_mapping[session.get('school').id].forEach((store) => {
      Object.keys(session.get('user').account_level_privileges[store]).forEach((privilege) => {
        if (privilegeType === +privilege) {
          hasAccountAccess = true;
        }
      });
    });
  } catch (error) {
    return false;
  }

  return hasAccountAccess;
};

export const canSchoolReadResource = (session: Map<any, any>, privilegeType: number) => {
  if (schoolLevelEmpty(session.get('user'))) {
    return false;
  }

  if (!(session.get('school').id in session.get('user').school_level_privileges)) {
    return false;
  }

  const schoolPrivileges = session.get('user').school_level_privileges[session.get('school').id];

  if (privilegeType in schoolPrivileges) {
    return schoolPrivileges[privilegeType].r;
  }

  return false;
};

export const canSchoolWriteResource = (session: Map<any, any>, privilegeType: number) => {
  if (schoolLevelEmpty(session.get('user'))) {
    return false;
  }

  if (!Object.keys(session.get('user').school_level_privileges).length) {
    return false;
  }

  if (!(session.get('school').id in session.get('user').school_level_privileges)) {
    return false;
  }

  const schoolPrivileges = session.get('user').school_level_privileges[session.get('school').id];

  if (privilegeType in schoolPrivileges) {
    return schoolPrivileges[privilegeType].w;
  }

  return false;
};

export const canClientReadResource = (session: Map<any, any>, privilegeType: number) => {
  if (clientLevelEmpty(session.get('user'))) {
    return false;
  }

  if (!(session.get('school').client_id in session.get('user').client_level_privileges)) {
    return false;
  }

  const schoolPrivileges = session.get('user').client_level_privileges[
    session.get('school').client_id
  ];

  if (privilegeType in schoolPrivileges) {
    return schoolPrivileges[privilegeType].r;
  }

  return false;
};

export const canClientWriteResource = (session: Map<any, any>, privilegeType: number) => {
  if (clientLevelEmpty(session.get('user'))) {
    return false;
  }

  if (!Object.keys(session.get('user').client_level_privileges).length) {
    return false;
  }

  if (!(session.get('school').client_id in session.get('user').client_level_privileges)) {
    return false;
  }

  const schoolPrivileges = session.get('user').client_level_privileges[
    session.get('school').client_id
  ];

  if (privilegeType in schoolPrivileges) {
    return schoolPrivileges[privilegeType].w;
  }

  return false;
};

export const privacyConfigurationOn = (session: Map<any, any>) => {
  return !canSchoolReadResource(session, CP_PRIVILEGES_MAP.contact_trace_pii);
};
