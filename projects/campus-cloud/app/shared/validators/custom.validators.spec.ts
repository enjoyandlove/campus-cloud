import { FormControl } from '@angular/forms';

import { CustomValidators } from './custom.validators';

function createControl(): FormControl {
  return new FormControl('');
}

describe('CustomValidators', () => {
  describe('requiredNonEmpty', () => {
    let ctrl: FormControl;

    beforeEach(() => {
      ctrl = createControl();
      ctrl.setValidators(CustomValidators.requiredNonEmpty);
    });

    it('should return error on empty string', () => {
      ctrl.setValue('');
      expect(ctrl.valid).toBe(false);
    });

    it('should return error on null', () => {
      ctrl.setValue(null);
      expect(ctrl.valid).toBe(false);
    });

    it('should not return error on "  string"', () => {
      ctrl.setValue('  string');
      expect(ctrl.valid).toBe(true);
    });

    it('should not return error on "string  "', () => {
      ctrl.setValue('string  ');
      expect(ctrl.valid).toBe(true);
    });

    it('should not return error on valid input', () => {
      ctrl.setValue('some');
      expect(ctrl.valid).toBe(true);
    });
  });

  describe('positiveInteger', () => {
    let ctrl: FormControl;

    beforeEach(() => {
      ctrl = createControl();
      ctrl.setValidators(CustomValidators.positiveInteger);
    });

    it('should return error on null', () => {
      ctrl.setValue(null);
      expect(ctrl.valid).toBe(false);
    });

    it('should return error on negative input', () => {
      ctrl.setValue(-1);
      expect(ctrl.valid).toBe(false);
    });

    it('should return error on string', () => {
      ctrl.setValue('one');
      expect(ctrl.valid).toBe(false);
    });

    it('should not return error on positive input', () => {
      ctrl.setValue(3);
      expect(ctrl.valid).toBe(true);
    });
  });

  describe('oneOf', () => {
    let ctrl: FormControl;
    const options = [1, 2, 3];

    beforeEach(() => {
      ctrl = createControl();
      ctrl.setValidators(CustomValidators.oneOf(options));
    });

    it('should return error if input not in options', () => {
      ctrl.setValue(5);
      expect(ctrl.valid).toBe(false);
    });

    it('should not return error if input in options', () => {
      ctrl.setValue(options[0]);
      expect(ctrl.valid).toBe(true);
    });
  });

  describe('emailWithTopLevelDomain', () => {
    let ctrl: FormControl;
    beforeEach(() => {
      ctrl = createControl();
      ctrl.setValidators(CustomValidators.emailWithTopLevelDomain);
    });

    it('should fail invalid email', () => {
      ctrl.setValue('address');
      expect(ctrl.valid).toBe(false);
    });

    it('should fail missing TLD', () => {
      ctrl.setValue('address@domain');
      expect(ctrl.errors.topLevelDomain).toBe(true);
      expect(ctrl.valid).toBe(false);
    });

    it('should pass valid address', () => {
      ctrl.setValue('address@domain.tld');
      expect(ctrl.errors).toBe(null);
      expect(ctrl.valid).toBe(true);
    });
  });
});
