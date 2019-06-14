import { IEnvironment } from './environment.interface';

export const environment: IEnvironment = {
  root: '/dist/',
  production: true,
  flags: {},
  envName: 'production_canada',
  keys: {
    sentryDsn: 'https://0b6c76a5691d4b7399394aa79753acef@sentry.io/207033'
  }
};
