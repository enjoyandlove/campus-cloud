function cleanNullValues(obj: any): any {
  if (Array.isArray(obj)) {
    return obj;
  }

  const _obj = {};

  Object.keys(obj).forEach((key) => {
    if (obj[key] !== null) {
      _obj[key] = obj[key];
    }
  });

  return _obj;
}

export const CPObj = {
  cleanNullValues,
};
