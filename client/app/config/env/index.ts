export const ENV = process.env.ENV;

export const isProd = ENV === 'production';
export const isStaging = ENV === 'staging';

export const isDev = !isProd && !isStaging;
