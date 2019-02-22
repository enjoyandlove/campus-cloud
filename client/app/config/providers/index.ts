import { ErrorHandler } from '@angular/core';

import { CPSession } from '@app/session';
import { CPErrorHandler } from './error.handler';
import { isProd, isStaging } from '@app/config/env';
import { AuthGuard, PrivilegesGuard } from '@app/config/guards';
import { CPI18nService, ErrorService, ZendeskService } from '@shared/services';

const COMMON_APP_PROVIDERS = [
  CPSession,
  AuthGuard,
  ErrorService,
  CPI18nService,
  ZendeskService,
  PrivilegesGuard
];
const PROD_APP_PROVIDERS = [{ provide: ErrorHandler, useClass: CPErrorHandler }];

export const APP_PROVIDERS =
  isProd || isStaging
    ? [...COMMON_APP_PROVIDERS, ...PROD_APP_PROVIDERS]
    : [...COMMON_APP_PROVIDERS];
