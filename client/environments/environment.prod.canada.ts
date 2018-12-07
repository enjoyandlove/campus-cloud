import { IEnvironment } from './environment.interface';

export const environment: IEnvironment = {
  root: '/dist/',
  production: true,
  flags: {
    EVENTS_INTEGRATION: {
      active: false,
      internal: true
    },
    ITEMS_INTEGRATION: {
      active: false,
      internal: true
    }
  },
  envName: 'production_canada'
};
