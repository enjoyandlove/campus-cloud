import { IEnvironment } from './environment';
import { EVENTS_INTEGRATION } from '@shared/constants';

export const environment: IEnvironment = {
  root: '/dist/',
  production: true,
  flags: {
    [EVENTS_INTEGRATION]: {
      active: false,
      internal: true
    }
  },
  envName: 'production_usa'
};
