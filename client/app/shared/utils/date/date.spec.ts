import { CPDate } from './date';

const dateStr = '2018-03-29T14:22:17.592Z';
const mockEpochDate = 1522347737;

describe('CPDate', () => {
  it('Should convert a valid Date object to epoch time', () => {
    expect(CPDate.toEpoch(dateStr, 'America/Toronto')).toBe(mockEpochDate);
  });

  it('Should convert an epoch timestamp into a valid Date Object', () => {
    expect(CPDate.fromEpoch(mockEpochDate, 'America/Toronto').toISOString()).toEqual(
      '2018-03-29T18:22:17.000Z'
    );
  });
});
