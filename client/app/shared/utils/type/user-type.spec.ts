import { UserType } from './';

describe('UserType', () => {
  let email;

  it('isInternal', () => {
    email = 'hello@customer.com';
    expect(UserType.isInternal(email)).toBe(false);

    email = 'hello@oohlalamobile.com';
    expect(UserType.isInternal(email)).toBe(true);

    email = 'hello@dublabs.com';
    expect(UserType.isInternal(email)).toBe(true);
  });
});
