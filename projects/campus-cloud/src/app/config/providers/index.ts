import { ErrorHandler } from '@angular/core';

import { CPSession } from '@campus-cloud/session';
import { CPErrorHandler } from './error.handler';
import { isProd, isStaging } from '@campus-cloud/config/env';
import { AuthGuard, PrivilegesGuard } from '@campus-cloud/config/guards';
import { CPI18nService, ErrorService, ZendeskService } from '@campus-cloud/shared/services';

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
