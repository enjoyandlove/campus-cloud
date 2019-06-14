import { environment } from '@campus-cloud/src/environments/environment';

/**
 * General Prod
 */
export const isProd = environment.production && environment.envName !== 'staging';

/**
 * General Staging
 */
export const isStaging = environment.envName === 'staging';

/**
 * Canada Prod Only
 */
export const isCanada = environment.envName === 'production_canada';

/**
 * USA Prod Only
 */
export const isUsa = environment.envName === 'production_usa';

/**
 * DEV
 */
export const isDev = environment.envName === 'development';
