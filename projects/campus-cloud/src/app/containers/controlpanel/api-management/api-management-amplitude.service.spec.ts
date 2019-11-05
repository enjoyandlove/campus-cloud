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
    it('should have "User Information" type', () => {
      permissionObject = { [ApiType.user]: AccessType.write };

      const result = ApiManagementAmplitudeService.getApiType(permissionObject);

      expect(result).toEqual(amplitudeEvents.USER_INFORMATION);
    });

    it('should have "Push Notification" type', () => {
      permissionObject = { [ApiType.notification]: AccessType.write };

      const result = ApiManagementAmplitudeService.getApiType(permissionObject);

      expect(result).toEqual(amplitudeEvents.PUSH_NOTIFICATION);
    });

    it('should have "Not Selected" type', () => {
      permissionObject = {
        [ApiType.audience]: AccessType.write
      };

      const result = ApiManagementAmplitudeService.getApiType(permissionObject);

      expect(result).toEqual(amplitudeEvents.NOT_SELECTED);
    });

    it('should have "Both" type', () => {
      permissionObject = {
        [ApiType.user]: AccessType.write,
        [ApiType.notification]: AccessType.write
      };

      const result = ApiManagementAmplitudeService.getApiType(permissionObject);

      expect(result).toEqual(amplitudeEvents.BOTH);
    });
  });

  describe('Audience Type', () => {
    it('should have "Audience" type', () => {
      permissionObject = { [ApiType.audience]: AccessType.write };

      const result = ApiManagementAmplitudeService.getAudienceType(permissionObject);

      expect(result).toEqual(amplitudeEvents.AUDIENCE);
    });

    it('should have "Experience" type', () => {
      permissionObject = { [ApiType.experience]: AccessType.write };

      const result = ApiManagementAmplitudeService.getAudienceType(permissionObject);

      expect(result).toEqual(amplitudeEvents.EXPERIENCE);
    });

    it('should have "Campus" type', () => {
      permissionObject = { [ApiType.campus]: AccessType.write };

      const result = ApiManagementAmplitudeService.getAudienceType(permissionObject);

      expect(result).toEqual(amplitudeEvents.CAMPUS);
    });

    it('should have "Al" type', () => {
      permissionObject = {
        [ApiType.audience]: AccessType.write,
        [ApiType.experience]: AccessType.write
      };

      const result = ApiManagementAmplitudeService.getAudienceType(permissionObject);

      expect(result).toEqual(amplitudeEvents.ALL);
    });

    it('should have "Not Selected" type', () => {
      permissionObject = {
        [ApiType.user]: AccessType.write
      };

      const result = ApiManagementAmplitudeService.getAudienceType(permissionObject);

      expect(result).toEqual(amplitudeEvents.NOT_SELECTED);
    });
  });

  describe('All Amplitude Event Properties', () => {
    it('should get event properties', () => {
      const permission_data = {
        [ApiType.user]: AccessType.write,
        [ApiType.audience]: AccessType.write
      };

      const data = {
        id: 123,
        permission_data
      };

      const result = ApiManagementAmplitudeService.getEventProperties(data);
      const properties = {
        api_key_id: 123,
        audience_type: amplitudeEvents.AUDIENCE,
        api_type: amplitudeEvents.USER_INFORMATION
      };

      expect(result).toEqual(properties);
    });
  });
});
