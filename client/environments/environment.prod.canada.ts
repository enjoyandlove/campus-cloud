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
    },
    WALLS_INTEGRATION: {
      active: false,
      internal: true
    },
    DINING: {
      active: false,
      internal: true
    }
  },
  envName: 'production_canada',
  keys: {
    sentryDsn: 'https://0b6c76a5691d4b7399394aa79753acef@sentry.io/207033'
  }
};
