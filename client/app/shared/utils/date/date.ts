import * as moment from 'moment';

function toEpoch(date, tz): number {
  return moment(moment.parseZone(date, tz).format('YYYY-MM-DD HH:mm:ss')).unix();
}

function fromEpoch(timestamp, tz) {
  return moment.parseZone(moment(timestamp * 1000), tz).toDate();
}

export const CPDate = {
  toEpoch,
  fromEpoch
};
