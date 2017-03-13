import { AuthGuard } from '../guards';
import { ErrorService } from '../../shared/services';

export const APP_PROVIDERS = [ AuthGuard, ErrorService ];
