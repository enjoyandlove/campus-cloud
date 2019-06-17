import { ExtraDataType } from '../../models';
import { mockIntegrationData, mockExtraData } from '../../tests';
import { IntegrationDataUtils } from './integration-data-utils.service';

describe('IntegrationDataUtils', () => {
  it('should get directory data', () => {
    const extraData = IntegrationDataUtils.getExtraData(
      mockIntegrationData,
      ExtraDataType.DIRECTORY
    );
    expect(extraData).toEqual(mockExtraData);
  });
});
