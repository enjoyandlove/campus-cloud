import { TestBed, async } from '@angular/core/testing';

import { configureTestSuite } from '@campus-cloud/shared/tests';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { AccessType, ApiType } from './model/api-management.interface';
import { ApiManagementAmplitudeService } from './api-management-amplitude.service';

describe('ApiManagementAmplitudeService', () => {
  configureTestSuite();

  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({ providers: [ApiManagementAmplitudeService] });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let permissionObject = {};

  beforeEach(async(() => {}));

  describe('API Type', () => {
    it('should have type user information', () => {
      permissionObject = { [ApiType.user]: AccessType.write };

      const result = ApiManagementAmplitudeService.getApiType(permissionObject);

      expect(result).toEqual(amplitudeEvents.USER_INFORMATION);
    });

    it('should have type push notification', () => {
      permissionObject = { [ApiType.notification]: AccessType.write };

      const result = ApiManagementAmplitudeService.getApiType(permissionObject);

      expect(result).toEqual(amplitudeEvents.PUSH_NOTIFICATION);
    });

    it('should have type both', () => {
      permissionObject = {
        [ApiType.user]: AccessType.write,
        [ApiType.notification]: AccessType.write
      };

      const result = ApiManagementAmplitudeService.getApiType(permissionObject);

      expect(result).toEqual(amplitudeEvents.BOTH);
    });
  });

  it('should get event properties', () => {
    const permission_data = { [ApiType.user]: AccessType.write };
    const data = {
      id: 123,
      permission_data
    };

    const result = ApiManagementAmplitudeService.getEventProperties(data);
    const properties = { api_key_id: 123, api_type: amplitudeEvents.USER_INFORMATION };

    expect(result).toEqual(properties);
  });
});
