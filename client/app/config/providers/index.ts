import { ErrorHandler } from '@angular/core';

import { AuthGuard } from '../guards';
import { CPSession } from '../../session';
import { RavenErrorHandler } from './raven.handler';
import { ErrorService } from '../../shared/services';
import { CPI18nService } from './../../shared/services/i18n.service';

export const APP_PROVIDERS = [
  CPSession,
  AuthGuard,
  ErrorService,
  CPI18nService,
  { provide: ErrorHandler, useClass: RavenErrorHandler }
];
