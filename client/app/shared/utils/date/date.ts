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
  const schoolOffset = moment.tz(timestamp, tz).utcOffset();
  const localOffset = moment(timestamp).utcOffset();
  const localMoment = moment(timestamp * 1000);
  localMoment.add(schoolOffset - localOffset, 'm');
  return localMoment;
}

function getMonth(date, tz) {
  const epochDate = fromEpoch(date, tz);

  return moment(epochDate).format('MMMM');
}

function getTimeDuration(time, unit = null) {
  unit = unit ? unit : 'seconds';

  return moment.duration(time, unit);
}

function format(date, formatStr) {
  return moment(date).format(formatStr);
}

export const CPDate = {
  now,
  format,
  toEpoch,
  getMonth,
  fromEpoch,
  getTimeDuration
};
