import { Headers } from '@angular/http';
import { appStorage } from '../../shared/utils/localStorage';

const API_VERSION = {
  'V1': 'v1'
};

const API_BASE_URL = `https://api.studentlifemobile.com/cc`;
// const API_BASE_URL = 'http://ec2-54-234-212-53.compute-1.amazonaws.com:5002/cc';

const API_KEY = 'IUm65kXecFWch54mzJjpy63spWZX3AVp';

const API_ENDPOINTS = {
  ADMIN: 'admin',
  STORE: 'store',
  EVENT: 'event',
  IMAGE: 'image',
  SESSION: 'session',
  P_RESET: 'ns_admin',
  SERVICES: 'services',
  LINKS: 'campus_link',
  EVENT_ASSESMENT: 'event_assessment',
};

const API_AUTH_HEADER = {
  TOKEN: 'CCToke',
  SESSION: 'CCSess'
};

const BUILD_COMMON_HEADERS = function buildCommonHeaders() {
  const auth = `${API_AUTH_HEADER.SESSION} ${appStorage.get(appStorage.keys.SESSION)}`;

  return new Headers({
    'Content-Type': 'application/json',
    'Authorization': auth
  });
};

export const API = {
  KEY: API_KEY,
  VERSION: API_VERSION,
  BUILD_COMMON_HEADERS,
  BASE_URL: API_BASE_URL,
  ENDPOINTS: API_ENDPOINTS,
  AUTH_HEADER: API_AUTH_HEADER,
};
