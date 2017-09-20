import { ErrorHandler } from '@angular/core';

import { AuthGuard } from '../guards';
import { CPSession } from '../../session';
import { RavenErrorHandler } from './raven.handler';
import { ErrorService } from '../../shared/services';

export const APP_PROVIDERS = [
  CPSession,
  AuthGuard,
  ErrorService,
  { provide: ErrorHandler, useClass: RavenErrorHandler }
];
