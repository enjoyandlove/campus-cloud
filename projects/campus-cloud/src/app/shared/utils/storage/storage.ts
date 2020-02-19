import { base64 } from '../encrypt';

const STORAGE_KEYS = {
  SESSION: 'session',
  WHATS_NEW: 'whats_new',
  HELP_ICON: 'help_icon',
  DEFAULT_SCHOOL_ID: 'default_school_id'
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
}

function set(key: string, value: string): void {
  localStorage.setItem(base64.encode(key), base64.encode(value));
}

function get(key: string) {
  const obj = localStorage.getItem(base64.encode(key));

  return obj ? base64.decode(obj) : null;
}

function remove(key: string) {
  localStorage.removeItem(base64.encode(key));
}

function clear() {
  localStorage.clear();
}

export const appStorage = {
  set,
  get,
  clear,
  remove,
  storageAvailable,
  keys: STORAGE_KEYS
};
