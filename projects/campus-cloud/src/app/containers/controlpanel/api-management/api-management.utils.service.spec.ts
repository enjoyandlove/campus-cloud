import { TestBed, async } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';

import { configureTestSuite } from '@campus-cloud/shared/tests';
import { defaultForm } from '@controlpanel/api-management/tests';
import { AccessType, ApiType } from './model/api-management.interface';
import { ApiManagementUtilsService } from './api-management.utils.service';
import { PublicApiAccessTokenModel } from '@controlpanel/api-management/model';

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

  let form: FormGroup;

  beforeEach(async(() => {
    form = PublicApiAccessTokenModel.form();
  }));

  it('should get token prefix', () => {
    const expected = 'live_';
    const token = 'live_fpMjJ4BHfLcOWxgrjCXfXHgDchh';
    const result = ApiManagementUtilsService.getAPIKeyPrefix(token);

    expect(result).toEqual(expected);
  });

  describe('parseFormValue', () => {
    it('should add user info api permission', () => {
      const permissionDataCtrl = form.get('permission_data') as FormGroup;
      permissionDataCtrl.get(ApiType.user).setValue(true);

      const expected = {
        ...defaultForm,
        permission_data: { [ApiType.user]: AccessType.write }
      };

      const result = ApiManagementUtilsService.parseFormValue(form);

      expect(result).toEqual(expected);
    });

    it('should remove user info api permission', () => {
      const permissionDataCtrl = form.get('permission_data') as FormGroup;
      permissionDataCtrl.get(ApiType.user).setValue(false);

      const expected = {
        ...defaultForm,
        permission_data: {}
      };

      const result = ApiManagementUtilsService.parseFormValue(form);

      expect(result).toEqual(expected);
    });
  });
});
