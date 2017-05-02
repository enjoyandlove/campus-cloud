import { AuthGuard } from '../guards';
import { ErrorService } from '../../shared/services';

import { CPSession } from '../../session';

export const APP_PROVIDERS = [ CPSession, AuthGuard, ErrorService ];
