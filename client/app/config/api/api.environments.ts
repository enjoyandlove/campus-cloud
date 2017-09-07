import { isProd, isCanada, isSea } from '../../config/env';

const CP_API_URL = {
  USA: 'https://api.studentlifemobile.com/cc',

  CAN: 'https://canapi.studentlifemobile.com/cc',

  SEA: 'https://seaapi.studentlifemobile.com/cc',

  DEV: 'https://usstagingapi.studentlifemobile.com/cc'
}

export const getUrlByEnv = () => {
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
