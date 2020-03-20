import { FormGroup, FormBuilder } from '@angular/forms';
import { validThread } from '.';

describe('Feeds Validators', () => {
  describe('validThread', () => {
    let form: FormGroup;

    beforeEach(() => {
      const fb = new FormBuilder();
      form = fb.group(
        {
          message: '',
          message_image_url_list: [[]]
        },
        { validators: validThread }
      );
    });

    it('should return invalid when both required fields are missing', () => {
      expect(form.valid).toBe(false);
    });

    it('should return true when message has value', () => {
      const validInput = 'hello';

      form.get('message').setValue(validInput);
      expect(form.valid).toBe(true);
    });

    it('should return true when message_image_url_list has value', () => {
      const validInput = 'hello';

      form.get('message').setValue(validInput);
      expect(form.valid).toBe(true);
    });
  });
});
