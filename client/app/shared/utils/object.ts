function cleanNullValues(obj: any) {
  if (Array.isArray(obj)) { return obj; }

  let _obj = {};

  Object.keys(obj).forEach(key => {
    if (obj[key] !== null) {
      _obj[key] = obj[key];
    }
  });

  return _obj;
};

export const CPObj = {
  cleanNullValues
};
