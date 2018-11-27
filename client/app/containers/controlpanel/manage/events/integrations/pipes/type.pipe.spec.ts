import { EventIntegrationTypePipe } from './type.pipe';
import { EventIntegration } from './../model/integration.model';

describe('EventIntegrationTypePipe', () => {
  let pipe: EventIntegrationTypePipe;

  beforeEach(() => {
    pipe = new EventIntegrationTypePipe();
  });

  it('should convert atom', () => {
    const expected = 'ATOM';
    const result = pipe.transform(EventIntegration.types.atom);

    expect(result).toEqual(expected);
  });

  it('should convert ical', () => {
    const expected = 'ICAL';
    const result = pipe.transform(EventIntegration.types.ical);

    expect(result).toEqual(expected);
  });

  it('should convert rss', () => {
    const expected = 'RSS';
    const result = pipe.transform(EventIntegration.types.rss);

    expect(result).toEqual(expected);
  });
});
