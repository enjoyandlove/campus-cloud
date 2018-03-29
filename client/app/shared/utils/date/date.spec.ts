import { CPDate } from './date';

import * as moment from 'moment';

const mockDateObj = moment('December 22nd 2016, 2:00 pm', 'MMMM Do YYYY, h:mm a');
const mockEpochDate = 1482433200;

describe('CPDate', () => {
  it('Should convert a valid Date object to epoch time', () => {
    expect(CPDate.toEpoch(mockDateObj, 'America/Toronto')).toBe(mockEpochDate);
  });

  it('Should convert an epoch timestamp into a valid Date Object', () => {
    expect(CPDate.fromEpoch(mockEpochDate, 'America/Toronto').format()).toEqual(
      mockDateObj.format()
    );
  });
});
