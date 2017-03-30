import { base64 } from './base64';

const STORAGE_KEYS = {
  'SESSION': 'session',
  'LANGUAGE': 'language',
  'PRIVILEGES': 'privileges'
};

const storageAvailable = function storageAvailable() {
  const test = 'test';
  try {
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

const set = function set(key: string, value: string): void {
  localStorage.setItem(base64.encode(key), base64.encode(value));
};

const get = function get(key: string) {
  const obj = localStorage.getItem(base64.encode(key));
  return obj ? base64.decode(obj) : null;
};

const remove = function remove(key: string) {
  localStorage.removeItem(base64.encode(key));
};

const clear = function clear() {
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
