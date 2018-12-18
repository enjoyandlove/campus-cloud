import { isCanada, isProd, isSea } from '../../config/env';

const CP_API_URL = {
  USA: 'https://api.studentlifemobile.com/cc',

  CAN: 'https://canapi.studentlifemobile.com/cc',

  SEA: 'https://seaapi.studentlifemobile.com/cc',

  DEV: 'https://usstagingapi.studentlifemobile.com/cc'

  // DEV: 'http://ec2-54-146-246-81.compute-1.amazonaws.com:5009/cc'
};

export const getUrlByEnv = () => {
  if (isProd) {
    if (isCanada) {
      return CP_API_URL.CAN;
    } else if (isSea) {
      return CP_API_URL.SEA;
    }

    return CP_API_URL.USA;
  }

  return CP_API_URL.DEV;
};
