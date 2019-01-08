import { isCanada, isProd } from '../../config/env';

const CP_API_URL = {
  USA: 'https://api.studentlifemobile.com/cc',

  CAN: 'https://canapi.studentlifemobile.com/cc',

  // DEV: 'https://usstagingapi.studentlifemobile.com/cc'

  DEV: 'http://ec2-54-146-246-81.compute-1.amazonaws.com:5009/cc'
};

export const getUrlByEnv = () => {
  if (isProd) {
    return isCanada ? CP_API_URL.CAN : CP_API_URL.USA;
  }

  return CP_API_URL.DEV;
};
