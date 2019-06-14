import { CPSession } from '@campus-cloud/session';
import { CPDatePipe, FORMAT } from './date.pipe';

const mockSession = new CPSession();
const date = 1504881271; // Friday, September 8, 2017 10:34:31 AM  (EST)
mockSession.g.set('school', { tz_zoneinfo_str: 'America/Toronto' });

describe('Date Pipe', () => {
  const pipe = new CPDatePipe(mockSession);

  it('Short format should look like "MMM D, YYYY"', () => {
    expect(pipe.transform(date, FORMAT.SHORT)).toContain('Sep 8, 2017');
  });

  it('Long format should look like "dddd, MMMM D, YYYY"', () => {
    expect(pipe.transform(date, FORMAT.LONG)).toContain('Friday, September 8th, 2017');
  });

  it('Date Time format should look like "MMMM Do YYYY, h:mm a"', () => {
    expect(pipe.transform(date, FORMAT.DATETIME)).toContain('Sep 8, 2017 10:34 am');
  });

  it('Time format should look like "h:mm A"', () => {
    expect(pipe.transform(date, FORMAT.TIME)).toContain('10:34 AM');
  });
});
