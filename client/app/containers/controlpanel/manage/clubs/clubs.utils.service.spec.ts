import { CP_PRIVILEGES_MAP } from './../../../../shared/constants/privileges';
import { ClubsUtilsService } from './clubs.utils.service';
import { CPSession } from '../../../../session';

const mockUser = (w = true) => {
  return {
    account_level_privileges: {
      1: {
        [CP_PRIVILEGES_MAP.clubs]: {
          r: true,
          w
        }
      }
    }
  };
};

const service = new ClubsUtilsService();
const mockSession = new CPSession();

describe('ClubsUtilsService', () => {
  let mockClub;

  beforeEach(() => {
    mockClub = {};
  });

  it('isSJSU', () => {
    expect(service.isSJSU(mockClub)).toBeFalsy();

    mockClub = { ...mockClub, advisor_firstname: 'Andres' };

    expect(service.isSJSU(mockClub)).toBeTruthy();
  });

  it('limitedAdmin', () => {
    mockSession.g.set('user', mockUser(false));
    expect(service.limitedAdmin(mockSession.g, 1)).toBeTruthy();

    mockSession.g.set('user', mockUser());
    expect(service.limitedAdmin(mockSession.g, 1)).toBeFalsy();
  });
});
