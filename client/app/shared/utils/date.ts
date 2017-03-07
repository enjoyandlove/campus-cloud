import * as moment from 'moment';

const toEpoch = function toEpoch(date) {
  let d = moment(date).toDate();

  return Math.round(d.getTime() / 1000);
};

const fromEpoch = function fromEpoch(epoch) {
  return new Date(epoch * 1000);
};

export const CPDate = {
  toEpoch,
  fromEpoch,
};

