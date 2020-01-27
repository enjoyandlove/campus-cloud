import { TestBed, async } from '@angular/core/testing';

import { CPSession } from '@campus-cloud/session';
import { ClubsUtilsService } from './clubs.utils.service';
import { mockClubUser } from '@controlpanel/manage/clubs/tests';
import { mockSchool, mockUser } from '@campus-cloud/session/mock';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';

describe('ClubsUtilsService', () => {
  configureTestSuite();

  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({ imports: [CPTestModule], providers: [ClubsUtilsService] });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let mockClub;
  let session: CPSession;
  let service: ClubsUtilsService;

  beforeEach(async(() => {
    mockClub = {};
    session = TestBed.get(CPSession);
    session.g.set('user', mockUser);
    session.g.set('school', mockSchool);
    service = TestBed.get(ClubsUtilsService);
  }));

  it('isSJSU', () => {
    expect(ClubsUtilsService.isSJSU(mockClub)).toBeFalsy();

    mockClub = { ...mockClub, advisor_firstname: 'Andres' };

    expect(ClubsUtilsService.isSJSU(mockClub)).toBeTruthy();
  });

  it('limitedAdmin', () => {
    session.g.set('user', mockClubUser(false));
    session.g.set('school', { id: 157 });
    expect(service.limitedAdmin(session.g, 1)).toBeTruthy();

    session.g.set('user', mockClubUser());
    session.g.set('school', { id: 157 });
    expect(service.limitedAdmin(session.g, 1)).toBeFalsy();
  });
});
