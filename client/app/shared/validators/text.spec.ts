import { FormBuilder } from '@angular/forms';

import { CustomTextValidators } from './text';

describe('CustomTextValidators', () => {
  const fb = new FormBuilder();

  const formGroup = fb.group({
    name: ['', CustomTextValidators.requiredNonEmpty],
  });

  it('should check validation - fail (empty string)', () => {
    formGroup.get('name').setValue(' ');

    expect(formGroup.valid).toBe(false);
  });

  it('should check validation - fail (NULL)', () => {
    formGroup.get('name').setValue(null);

    expect(formGroup.valid).toBe(false);
  });

  it('should check validation - pass', () => {
    formGroup.get('name').setValue('Hello World');

    expect(formGroup.valid).toBe(true);
  });

});
