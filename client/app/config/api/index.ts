import { Headers } from '@angular/http';

import { isProd, isCanada, isSea } from '../../config/env';
import { appStorage } from '../../shared/utils/localStorage';

import * as RESOURCES from './api.resources';

let API_BASE_URL;

const API_VERSION = {
  'V1': 'v1'
};

if (isProd) {
  if (isCanada) {
    API_BASE_URL = `https://canapi.studentlifemobile.com/cc`;
  } else if (isSea) {
    API_BASE_URL = `https://seaapi.studentlifemobile.com/cc`;
  } else {
    API_BASE_URL = `https://api.studentlifemobile.com/cc`;
  }
} else {
  API_BASE_URL = 'https://usstagingapi.studentlifemobile.com/cc';
  // API_BASE_URL = 'http://ec2-54-234-212-53.compute-1.amazonaws.com:5002/cc';
}

const API_KEY = 'IUm65kXecFWch54mzJjpy63spWZX3AVp';

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

const BUILD_TOKEN_HEADERS = function buildTokenHeaders() {
  const auth = `${API_AUTH_HEADER.TOKEN} ${API_KEY}`;

  return new Headers({
    'Content-Type': 'application/json',
    'Authorization': auth
  });
};

export const API = {
  KEY: API_KEY,
  BUILD_TOKEN_HEADERS,
  VERSION: API_VERSION,
  BUILD_COMMON_HEADERS,
  BASE_URL: API_BASE_URL,
  AUTH_HEADER: API_AUTH_HEADER,
  ENDPOINTS: RESOURCES.API_ENDPOINTS
};
