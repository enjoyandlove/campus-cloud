import { ErrorHandler } from '@angular/core';

import { isProd } from './../env';
import { AuthGuard } from '../guards';
import { CPSession } from '../../session';
import { RavenErrorHandler } from './raven.handler';
import { ErrorService } from '../../shared/services';
import { CPI18nService } from './../../shared/services/i18n.service';

export const COMMON_PROVIDERS = [
  CPSession,
  AuthGuard,
  ErrorService,
  CPI18nService
];

const PROD_PROVIDERS = [
  { provide: ErrorHandler, useClass: RavenErrorHandler },
]

export const APP_PROVIDERS = isProd ?
                            [ ...COMMON_PROVIDERS, ...PROD_PROVIDERS ] :
                            [ ...COMMON_PROVIDERS ]

