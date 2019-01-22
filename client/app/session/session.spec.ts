import { CPSession } from './';

describe('Session', () => {
  let session: CPSession;
  beforeEach(() => {
    session = new CPSession();
  });

  it('isInternal', () => {
    session.g.set('user', { email: 'hello@customer.com' });
    expect(session.isInternal).toBeFalsy();

    session.g.set('user', { email: 'hello@oohlalamobile.com' });
    expect(session.isInternal).toBeTruthy();

    session.g.set('user', { email: 'hello@dublabs.com' });
    expect(session.isInternal).toBeTruthy();
  });

  it('should set hasSSO true', () => {
    session.g.set('school', {
      has_sso_integration: true
    });
    expect(session.hasSSO).toBe(true);
  });

  it('should set hasSSO false', () => {
    session.g.set('school', {
      has_sso_integration: false
    });
    expect(session.hasSSO).toBe(false);
  });
});
