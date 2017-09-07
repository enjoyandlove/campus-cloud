import { isProd, isCanada, isSea } from '../../config/env';

const CP_API_URL = {
  USA: 'https://api.studentlifemobile.com/cc',
  CAN: 'https://canapi.studentlifemobile.com/cc',
  SEA: 'https://seaapi.studentlifemobile.com/cc',
  DEV: 'https://usstagingapi.studentlifemobile.com/cc'
}

const fromEnvironment = () => {
  if (isProd) {
    if (isCanada) {
      return CP_API_URL.CAN
    } else if (isSea) {
      return CP_API_URL.SEA
    } else {
      return CP_API_URL.USA
    }
  } else {
    return CP_API_URL.DEV;
  }
}

class BaseApi {
  BASE_URL;

  KEY = 'IUm65kXecFWch54mzJjpy63spWZX3AVp';

  VERSION = {
    'V1': 'v1'
  }

  ENDPOINTS = require('./api.resources').API_ENDPOINTS;

  AUTH_HEADER = {
    TOKEN: 'CCToke',
    SESSION: 'CCSess'
  };

  constructor(BASE_URL: string) {
    this.BASE_URL = BASE_URL;
  }
}

export const API = new BaseApi(fromEnvironment())

// let API: BaseApi;

// if (isProd) {
//   if (isCanada) {
//     API = new BaseApi(CP_API_URL.CAN);
//   } else if (isSea) {
//     API = new BaseApi(CP_API_URL.SEA);
//   } else {
//     API = new BaseApi(CP_API_URL.USA);
//   }
// } else {
//   API = new BaseApi(CP_API_URL.DEV);
//   // http://ec2-54-234-212-53.compute-1.amazonaws.com:5002/cc
// }

// export default API;
