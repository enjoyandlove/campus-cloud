export class ValidationService {
  static emailValidator(control) {
    const REGEX = /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/;

    if (control.value.match(REGEX)) {
      return null;
    } else {
      return { 'invalidEmailAddress': true };
    }
  }

  static passwordValidator(control) {
    // {6,100}           - Assert password is between 6 and 100 characters
    // (?=.*[0-9])       - Assert a string has at least one number
    const REGEX = /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,100}$/;

    if (control.value.match(REGEX)) {
      return null;
    } else {
      return { 'invalidPassword': true };
    }
  }
}
