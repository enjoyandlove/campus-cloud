import { getUrlByEnv } from './api.environments';

export const API = {
  BASE_URL: getUrlByEnv(),

  KEY: 'IUm65kXecFWch54mzJjpy63spWZX3AVp',

  VERSION: {
    'V1': 'v1'
  },

  ENDPOINTS: require('./api.resources').API_ENDPOINTS,

  AUTH_HEADER: {
    TOKEN: 'CCToke',
    SESSION: 'CCSess'
  }
}

