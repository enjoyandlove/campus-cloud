import { ErrorHandler } from '@angular/core';

import { AuthGuard } from '../guards';

import { CPSession } from '../../session';
import { CPI18nService } from './../../shared/services/i18n.service';
import { ErrorService } from '../../shared/services';

import { isProd } from './../env';
import { RavenErrorHandler } from './raven.handler';

export const COMMON_PROVIDERS = [
  CPSession,
  AuthGuard,
  ErrorService,
  CPI18nService,
];

const PROD_PROVIDERS = [{ provide: ErrorHandler, useClass: RavenErrorHandler }];

export const APP_PROVIDERS = isProd
  ? [...COMMON_PROVIDERS, ...PROD_PROVIDERS]
  : [...COMMON_PROVIDERS];
