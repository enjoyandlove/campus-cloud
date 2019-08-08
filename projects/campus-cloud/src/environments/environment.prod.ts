import { IEnvironment } from './environment.interface';

export const environment: IEnvironment = {
  root: '/dist/',
  production: true,
  flags: {
    API_MANAGEMENT: {
      whitelist: []
    }
  },
  keys: {
    readyApiKey: 'IUm65kXecFWch54mzJjpy63spWZX3AVp',
    sentryDsn: 'https://0b6c76a5691d4b7399394aa79753acef@sentry.io/207033'
  }
};
