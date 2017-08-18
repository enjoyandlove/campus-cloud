import * as moment from 'moment';

function toEpoch(date) {
  let d = moment(date).toDate();

  return Math.round(d.getTime() / 1000);
};

function fromEpoch(epoch) {
  return moment(epoch * 1000).toDate();
};

export const CPDate = {
  toEpoch,
  fromEpoch,
};

