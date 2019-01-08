import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandler } from '@angular/core';

import { isProd } from '@app/config/env';
import { CPSession } from '@app/session';
import { RavenErrorHandler } from './raven.handler';
import { HttpCachingInterceptor } from '@shared/interceptors';
import { AuthGuard, PrivilegesGuard } from '@app/config/guards';
import { RequestCache, ErrorService, CPI18nService, ZendeskService } from '@shared/services';

const COMMON_APP_PROVIDERS = [
  CPSession,
  AuthGuard,
  RequestCache,
  ErrorService,
  CPI18nService,
  ZendeskService,
  PrivilegesGuard,
  { provide: HTTP_INTERCEPTORS, useClass: HttpCachingInterceptor, multi: true }
];

const PROD_APP_PROVIDERS = [{ provide: ErrorHandler, useClass: RavenErrorHandler }];

export const APP_PROVIDERS = isProd
  ? [...COMMON_APP_PROVIDERS, ...PROD_APP_PROVIDERS]
  : [...COMMON_APP_PROVIDERS];
