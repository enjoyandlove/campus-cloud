import { IntegrationTypePipe } from './type.pipe';
import { IntegrationTypes } from './../model/integration.interface';

describe('IntegrationTypePipe', () => {
  let pipe: IntegrationTypePipe;

  beforeEach(() => {
    pipe = new IntegrationTypePipe();
  });

  it('should convert atom', () => {
    const expected = 'ATOM';
    const result = pipe.transform(IntegrationTypes.atom);

    expect(result).toEqual(expected);
  });

  it('should convert ical', () => {
    const expected = 'ICAL';
    const result = pipe.transform(IntegrationTypes.ical);

    expect(result).toEqual(expected);
  });

  it('should convert rss', () => {
    const expected = 'RSS';
    const result = pipe.transform(IntegrationTypes.rss);

    expect(result).toEqual(expected);
  });
});
