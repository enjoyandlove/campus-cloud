import { CPDatePipe, FORMAT } from './date.pipe';

describe('Date Pipe', () => {
  const pipe = new CPDatePipe();

  it('Short format should look like "MMM D, YYYY"', () => {
    expect(pipe.transform(1504881271, FORMAT.SHORT)).toContain('Sep 8, 2017');
  });

  it('Long format should look like "dddd, MMMM D, YYYY"', () => {
    expect(pipe.transform(1504881271, FORMAT.LONG)).toContain('Friday, September 8, 2017');
  });

  it('Date Time format should look like "MMMM Do YYYY, h:mm a"', () => {
    expect(pipe.transform(1504881271, FORMAT.DATETIME)).toContain('September 8th 2017, 10:34 am');
  });

  it('Time format should look like "h:mm A"', () => {
    expect(pipe.transform(1504881271, FORMAT.TIME)).toContain('10:34 AM');
  });
});
