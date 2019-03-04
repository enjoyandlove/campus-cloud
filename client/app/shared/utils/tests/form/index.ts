import { FormGroup, AbstractControl } from '@angular/forms';

export const fillForm = (form: FormGroup, filledForm) => {
  for (const key in filledForm) {
    if (filledForm[key]) {
      form.get(key).setValue(filledForm[key]);
    }
  }

  return form;
};

export function validatePositiveInteger(ctrl: AbstractControl) {
  const tests = [
    { val: '', expected: false },
    { val: null, expected: false },
    { val: -1, expected: false },
    { val: 1, expected: true },
    { val: 'string', expected: false }
  ];

  tests.forEach((t) => {
    ctrl.setValue(t.val);
    expect(ctrl.valid).toBe(t.expected);
  });
}

export function validateOneOf(ctrl: AbstractControl, options: Array<number | string>) {
  const invalidInput = Date.now();
  const tests = options.map((o) => {
    return {
      val: o,
      expected: true
    };
  });
  tests.push({
    val: invalidInput,
    expected: false
  });

  tests.forEach((t) => {
    ctrl.setValue(t.val);
    expect(ctrl.valid).toBe(t.expected);
  });
}

export function validateMaxLength(ctrl: AbstractControl, maxLength: number) {
  ctrl.setValue('a'.repeat(maxLength + 1));
  expect(ctrl.valid).toBe(false);

  ctrl.setValue('a'.repeat(maxLength));
  expect(ctrl.valid).toBe(true);
}
