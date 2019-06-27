import { IntegrationStatusPipe, statusToLabelMapping } from './status.pipe';
import { IntegrationStatus } from './../model/integration.interface';

describe('IntegrationStatusPipe', () => {
  let pipe: IntegrationStatusPipe;
  beforeEach(() => {
    pipe = new IntegrationStatusPipe();
  });

  it('should convert error', () => {
    const expected = statusToLabelMapping[IntegrationStatus.error];
    const result = pipe.transform(IntegrationStatus.error);

    expect(result).toEqual(expected);
  });

  it('should convert pending', () => {
    const expected = statusToLabelMapping[IntegrationStatus.pending];
    const result = pipe.transform(IntegrationStatus.pending);

    expect(result).toEqual(expected);
  });

  it('should convert successful', () => {
    const expected = statusToLabelMapping[IntegrationStatus.successful];
    const result = pipe.transform(IntegrationStatus.successful);

    expect(result).toEqual(expected);
  });

  it('should convert running', () => {
    const expected = statusToLabelMapping[IntegrationStatus.running];
    const result = pipe.transform(IntegrationStatus.running);

    expect(result).toEqual(expected);
  });

  it('should return empty string if key not found', () => {
    const keyNotFoundInStatusToLabelMapping = -99;
    const result = pipe.transform(keyNotFoundInStatusToLabelMapping);

    expect(result).toEqual('');
  });
});
