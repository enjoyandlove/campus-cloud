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
  SCHOOL: 'school',
  SESSION: 'session',
  P_RESET: 'ns_admin',
  SERVICES: 'service',
  LINKS: 'campus_link',
  SOCIAL_GROUP: 'group',
  GROUP_THREAD: 'group_thread',
  GROUP_COMMENT: 'group_comment',
  CAMPUS_THREAD: 'campus_thread',
  CAMPUS_COMMENT: 'campus_comment',
  FB_EVENTS: 'facebook_event_link',
  EVENT_ASSESMENT: 'event_assessment',
  SERVICE_PROVIDER: 'service_provider',
  SERVICE_ASSESSMENT: 'service_assessment',
  SOCIAL_POST_CATEGORY: 'social_post_category',
  EXTERNAL_EVENT_CHECKIN: 'external_event_checkin',
  EXTERNAL_SERVICE_CHECKIN: 'external_service_checkin'
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
  ENDPOINTS: API_ENDPOINTS,
  AUTH_HEADER: API_AUTH_HEADER,
};
