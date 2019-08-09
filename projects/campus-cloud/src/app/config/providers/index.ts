import { ErrorHandler } from '@angular/core';

import { CPErrorHandler } from './error.handler';
import { CPSession } from '@campus-cloud/session';
import { ApiService } from '@campus-cloud/base/services';
import { AuthGuard, PrivilegesGuard } from '@campus-cloud/config/guards';
import { EnvServiceProvider } from '@campus-cloud/config/env/env.service.factory';
import { CPI18nService, ErrorService, ZendeskService } from '@campus-cloud/shared/services';

const COMMON_APP_PROVIDERS = [
  CPSession,
  AuthGuard,
  ApiService,
  ErrorService,
  CPI18nService,
  ZendeskService,
  PrivilegesGuard,
  EnvServiceProvider,
  { provide: ErrorHandler, useClass: CPErrorHandler }
];

export const APP_PROVIDERS = [...COMMON_APP_PROVIDERS];
