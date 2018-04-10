import * as moment from 'moment-timezone';

function now(): moment.Moment {
  return moment();
}

function toEpoch(date, tz): number {
  const dateWithNoTzData = moment.parseZone(date).format('YYYY-MM-DD HH:mm:ss');

  return moment.tz(dateWithNoTzData, tz).unix();
}

function fromEpoch(timestamp, tz): moment.Moment {
  return moment.tz(timestamp * 1000, tz);
}

export const CPDate = {
  now,
  toEpoch,
  fromEpoch
};
