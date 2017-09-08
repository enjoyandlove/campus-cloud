import { base64 } from '../base64';

const STORAGE_KEYS = {
  'SESSION': 'session',
  'LANGUAGE': 'language',
  'DEFAULT_SCHOOL': 'default_school'
};

 function storageAvailable() {
  const test = 'test';
  try {
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

function set(key: string, value: string): void {
  localStorage.setItem(base64.encode(key), base64.encode(value));
};

function get(key: string) {
  const obj = localStorage.getItem(base64.encode(key));
  return obj ? base64.decode(obj) : null;
};

function remove(key: string) {
  localStorage.removeItem(base64.encode(key));
};

function clear() {
  localStorage.clear();
};

export const appStorage = {
  set,
  get,
  clear,
  remove,
  storageAvailable,
  keys: STORAGE_KEYS
};
