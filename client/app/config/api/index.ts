import { isProd, isCanada, isSea } from '../../config/env';

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

export const API = {
  KEY: API_KEY,
  VERSION: API_VERSION,
  BASE_URL: API_BASE_URL,
  AUTH_HEADER: API_AUTH_HEADER,
  ENDPOINTS: RESOURCES.API_ENDPOINTS
};
