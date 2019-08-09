import { TestBed, async } from '@angular/core/testing';

import { configureTestSuite } from '@campus-cloud/shared/tests';
import { AccessType, ApiType } from './model/api-management.interface';
import { ApiManagementUtilsService } from './api-management.utils.service';

describe('ApiManagementUtilsService', () => {
  configureTestSuite();

  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({ providers: [ApiManagementUtilsService] });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let permissionObject = {};
  let hasPermission: boolean;
  const apiType = ApiType.user;

  beforeEach(async(() => {}));

  it('should add user info api permission', () => {
    hasPermission = true;
    const expected = { [ApiType.user]: AccessType.write };

    const result = ApiManagementUtilsService.getTokenPermission(
      hasPermission,
      apiType,
      permissionObject
    );

    expect(result).toEqual(expected);
  });

  it('should remove user info api permission', () => {
    hasPermission = false;
    permissionObject = { [ApiType.user]: AccessType.write };
    const expected = {};

    const result = ApiManagementUtilsService.getTokenPermission(
      hasPermission,
      apiType,
      permissionObject
    );

    expect(result).toEqual(expected);
  });
});
