export const accountsToStoreMap = (accountsMap: Array<number>, accountPrivileges) => {
  let accounts = {};

  accountsMap.map(storeId => {
    if (storeId in accountPrivileges) {
      accounts[storeId] = accountPrivileges[storeId];
    }
  });
  return accounts;
}

export const canStoreReadAndWriteResource = (session: Map<any, any>,
  storeId: number, privilegeType: number) => {

  if (storeId in session.get('user').account_level_privileges) {
    return privilegeType in session.get('user').account_level_privileges[storeId]
  }
  return false;
}

export const canAccountLevelReadResource = (session: Map<any, any>, privilegeType: number) => {
  let hasAccountAccess = false;

  session.get('user').account_mapping[session.get('school').id].forEach(store => {
    Object.keys(session.get('user').account_level_privileges[store]).forEach(privilege => {

      if (privilegeType === +privilege) {
        hasAccountAccess = true;
      }
    });
  });

  return hasAccountAccess;
}

export const canAccountLevelWriteResource = (session: Map<any, any>, privilegeType: number) => {
  let hasAccountAccess = false;

  session.get('user').account_mapping[session.get('school').id].forEach(store => {
    Object.keys(session.get('user').account_level_privileges[store]).forEach(privilege => {

      if (privilegeType === +privilege) {
        hasAccountAccess = true;
      }
    });
  });

  return hasAccountAccess;
}

export const canSchoolReadResource = (session: Map<any, any>, privilegeType: number) => {
  if (!(Object.keys(session.get('user').school_level_privileges).length)) {
    return false;
  }

  if (!(session.get('school').id in session.get('user').school_level_privileges)) {
    return false;
  }

  const schoolPrivileges = session.get('user').school_level_privileges[session.get('school').id];

  if (privilegeType in schoolPrivileges) {
    return schoolPrivileges[privilegeType].r
  }
  return false;
}

export const canSchoolWriteResource = (session: Map<any, any>, privilegeType: number) => {
  if (!(Object.keys(session.get('user').school_level_privileges).length)) {
    return false;
  }

  if (!(session.get('school').id in session.get('user').school_level_privileges)) {
    return false;
  }

  const schoolPrivileges = session.get('user').school_level_privileges[session.get('school').id];

  if (privilegeType in schoolPrivileges) {
    return schoolPrivileges[privilegeType].w
  }
  return false;
}
