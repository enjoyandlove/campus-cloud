import * as moment from 'moment-timezone';
const momentDurationFormat = require('moment-duration-format');
momentDurationFormat(moment);

function localNow(date = new Date()) {
  return moment(date);
}

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

function fromEpochLocal(timestamp, tz): moment.Moment {
  const schoolOffset = fromEpoch(timestamp, tz).utcOffset();
  const localMoment = moment(timestamp * 1000);
  const localOffset = localMoment.utcOffset();
  localMoment.add(schoolOffset - localOffset, 'minutes');

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

function enumerateDaysBetweenDates(startDate, endDate) {
  const dates = [];

  const currDate = moment(startDate);
  const lastDate = moment(endDate);

  while (currDate.diff(lastDate) < 0) {
    dates.push(currDate.clone());
    currDate.add(1, 'days');
  }

  return dates;
}

function format(date, formatStr) {
  return moment(date).format(formatStr);
}

export const CPDate = {
  now,
  format,
  toEpoch,
  localNow,
  getMonth,
  fromEpoch,
  fromEpochLocal,
  getTimeDuration,
  enumerateDaysBetweenDates
};
