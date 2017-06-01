/**
 * Any status string used in the
 * cp-alert component comes from this file
 *
 *  1.- AUTH
 *  2.- FORMS
 *  3.- GENERAL
 *  4.- IMAGE
 *
 */

export const STATUS = {
  /**
   * AUTH
   */
  PASSWORD_MIN_LENGTH: 'Make sure your password is at least 6 characters long',

  PASSWORDS_DO_NOT_MATCH: 'Passwords do not match',

  EMAIL_DOES_NOT_EXIST: 'I\'m sorry, but we weren\'t able to find a user\
   with that login information',

  NO_ACCOUNT_FOUND: 'Please check your credentials and try again.',

  /**
   * FORMS
   */
  ALL_FIELDS_ARE_REQUIRED: 'All fields are required',

  DUPLICATE_ENTRY: 'An entry like that already exists',

  /**
   * GENERAL
   */
  SOMETHING_WENT_WRONG: 'Something went wrong',

  /**
   * IMAGE
   */
  FILE_IS_TOO_BIG: 'File is too big',

  WRONG_EXTENSION: 'Unsupported file type',

  WRONG_EXTENSION_IMAGE: 'Please upload a JPG or PNG image',
};

