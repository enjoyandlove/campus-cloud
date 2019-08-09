import { FormGroup, AbstractControl } from '@angular/forms';

import { defaultForm, filledForm } from '../tests';
import { PublicApiAccessTokenModel } from './api-management.model';
import { fillForm, validateMaxLength } from '@campus-cloud/shared/utils/tests';

describe('PublicApiAccessTokenModel', () => {
  describe('form', () => {
    let form: FormGroup;
    let ctrl: AbstractControl;

    beforeEach(() => {
      form = PublicApiAccessTokenModel.form();
    });

    it('should return api management form', () => {
      expect(form.value).toEqual(defaultForm);
      expect(form instanceof FormGroup).toBe(true);
    });

    it('should validate name character limit to 250', () => {
      ctrl = form.get('name');

      ctrl.setValue('');
      expect(ctrl.valid).toBe(false);

      validateMaxLength(ctrl, 250);
    });

    it('should set valid to true when filled with the correct values', () => {
      fillForm(form, filledForm);
      expect(form.valid).toBe(true);
    });
  });
});
