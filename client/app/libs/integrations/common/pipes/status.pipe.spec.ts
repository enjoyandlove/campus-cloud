import { IntegrationStatusPipe } from './status.pipe';
import { IntegrationStatus } from './../model/integration.interface';

describe('IntegrationStatusPipe', () => {
  let pipe: IntegrationStatusPipe;
  beforeEach(() => {
    pipe = new IntegrationStatusPipe();
  });

  it('should convert error', () => {
    const expected = 't_shared_error';
    const result = pipe.transform(IntegrationStatus.error);

    expect(result).toEqual(expected);
  });

  it('should convert pending', () => {
    const expected = 't_shared_pending';
    const result = pipe.transform(IntegrationStatus.pending);

    expect(result).toEqual(expected);
  });

  it('should convert successful', () => {
    const expected = 't_shared_successful';
    const result = pipe.transform(IntegrationStatus.successful);

    expect(result).toEqual(expected);
  });
});
