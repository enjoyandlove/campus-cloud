import { async, TestBed } from '@angular/core/testing';

import { CPSession } from '@campus-cloud/session';
import { clubOnlyPermissions } from '../../permissions';
import { configureTestSuite } from '@campus-cloud/shared/tests';
import { mockSchool, mockUser } from '@campus-cloud/session/mock';
import { CP_PRIVILEGES_MAP } from '@campus-cloud/shared/constants';
import { TeamSelectModalPermissionPipe } from '../modal-permissions.pipe';

describe('TeamSelectModalPermissionPipe', () => {
  configureTestSuite();

  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        providers: [CPSession, TeamSelectModalPermissionPipe]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let storeId: number;
  let session: CPSession;
  let pipe: TeamSelectModalPermissionPipe;

  beforeEach(async(() => {
    session = TestBed.get(CPSession);
    session.g.set('school', mockSchool);
    pipe = TestBed.get(TeamSelectModalPermissionPipe);

    storeId = 1;
    const userWithClubAccess = {
      ...mockUser,
      school_level_privileges: {},
      account_level_privileges: {
        [storeId]: {
          [CP_PRIVILEGES_MAP.clubs]: {
            r: true,
            w: true
          }
        }
      }
    };
    session.g.set('user', userWithClubAccess);
  }));

  it('should filter permissions if privilege type is not club', () => {
    const privilegeType = CP_PRIVILEGES_MAP.services;

    const result = pipe.transform(clubOnlyPermissions, privilegeType, storeId);

    expect(result).toEqual(clubOnlyPermissions);
  });

  it('should filter permissions if privilege type is club and have school/account level privilege', () => {
    const privilegeType = CP_PRIVILEGES_MAP.clubs;

    const result = pipe.transform(clubOnlyPermissions, privilegeType, storeId);

    expect(result).toEqual(clubOnlyPermissions);
  });
});
