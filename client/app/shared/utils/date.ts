import * as moment from 'moment';

const toEpoch = function toEpoch(date) {
  let d = moment(date).toDate();

  return d.getTime() / 1000;
};

export const CPDate = {
  toEpoch,
};

