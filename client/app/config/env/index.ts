export const ENV = process.env.ENV;

/**
 * General Prod
 */
export const isProd =
  ENV === 'production-usa' || ENV === 'production-sea' || ENV === 'production-canada';

/**
 * General Staging
 */
export const isStaging = ENV === 'staging';

/**
 * Canada Prod Only
 */
export const isCanada = ENV === 'production-canada';

/**
 * USA Prod Only
 */
export const isUsa = ENV === 'production-usa';

/**
 * SEA prod only
 */
export const isSea = ENV === 'production-sea';

/**
 * DEV
 */
export const isDev = !isProd && !isStaging;
