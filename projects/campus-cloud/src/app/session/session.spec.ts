import { CPSession } from './';

describe('Session', () => {
  let session: CPSession;
  beforeEach(() => {
    session = new CPSession();
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
