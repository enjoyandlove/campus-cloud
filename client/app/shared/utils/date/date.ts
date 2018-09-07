import * as moment from 'moment-timezone';
import momentDurationFormatSetup = require('moment-duration-format');

momentDurationFormatSetup(moment);

function now(tz): moment.Moment {
  return moment.tz(moment(), tz);
}

function toEpoch(date, tz): number {
  const dateWithNoTzData = moment.parseZone(date).format('YYYY-MM-DD HH:mm:ss');

  return moment.tz(dateWithNoTzData, tz).unix();
}

function fromEpoch(timestamp, tz): moment.Moment {
  return moment.tz(timestamp * 1000, tz);
}

function getMonth(date, tz) {
  const epochDate = fromEpoch(date, tz);

  return moment(epochDate).format('MMMM');
}

function getTimeDuration(time, unit = null) {
  unit = unit ? unit : 'seconds';

  return moment.duration(time, unit);
}

export const CPDate = {
  now,
  toEpoch,
  getMonth,
  fromEpoch,
  getTimeDuration
};
