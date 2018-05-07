import { ErrorHandler } from '@angular/core';

import { isProd } from './../env';
import { CPSession } from '../../session';
import { AuthGuard, PrivilegesGuard } from '../guards';

import { CPI18nService, ErrorService, ZendeskService } from '../../shared/services';

import { RavenErrorHandler } from './raven.handler';

const COMMON_APP_PROVIDERS = [
  CPSession,
  AuthGuard,
  ErrorService,
  CPI18nService,
  ZendeskService,
  PrivilegesGuard
];

const PROD_APP_PROVIDERS = [{ provide: ErrorHandler, useClass: RavenErrorHandler }];

export const APP_PROVIDERS = isProd
  ? [...COMMON_APP_PROVIDERS, ...PROD_APP_PROVIDERS]
  : [...COMMON_APP_PROVIDERS];
