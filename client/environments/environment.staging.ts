import { IEnvironment } from './environment';

export const environment: IEnvironment = {
  root: '/dist/',
  production: true,
  flags: {
    '*': true
  },
  envName: 'staging'
};
