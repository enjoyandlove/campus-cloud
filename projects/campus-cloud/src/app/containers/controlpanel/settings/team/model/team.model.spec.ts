import { FormGroup } from '@angular/forms';

import { defaultForm, filledForm } from '../tests';
import { fillForm } from '@campus-cloud/shared/utils/tests';
import { TeamModel } from '@controlpanel/settings/team/model/team.model';

describe('TeamModel', () => {
  describe('form', () => {
    let form: FormGroup;

    beforeEach(() => {
      form = TeamModel.form();
    });

    it('should return team settings form', () => {
      expect(form.value).toEqual(defaultForm);
      expect(form instanceof FormGroup).toBe(true);
    });

    it('should set valid to true when filled with the correct values', () => {
      fillForm(form, filledForm);

      expect(form.valid).toBe(true);
    });
  });
});
