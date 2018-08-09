import { CPSession } from './';

describe('Session', () => {
  it('isInternal', () => {
    const session = new CPSession();

    session.g.set('user', { email: 'hello@customer.com' });

    expect(session.isInternal).toBeFalsy();

    session.g.set('user', { email: 'hello@oohlalamobile.com' });

    expect(session.isInternal).toBeTruthy();

    session.g.set('user', { email: 'hello@dublabs.com' });

    expect(session.isInternal).toBeTruthy();
  });
});
