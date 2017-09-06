import { AuthGuard } from '../guards';
import { RavenErrorHandler } from './raven.handler';
import { ErrorService } from '../../shared/services';
import { ErrorHandler } from '@angular/core';

import { CPSession } from '../../session';

export const APP_PROVIDERS = [
  CPSession,
  AuthGuard,
  ErrorService,
  { provide: ErrorHandler, useClass: RavenErrorHandler }
];
