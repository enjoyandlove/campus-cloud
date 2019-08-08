import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { ActivatedRoute } from '@angular/router';
import { of as observableOf } from 'rxjs';

import { ClubsService } from './../clubs.service';
import { ClubsInfoComponent } from './clubs-info.component';
import { ClubsUtilsService } from './../clubs.utils.service';
import { ClubsDetailsModule } from './../details/details.module';
import { CP_PRIVILEGES_MAP } from '@campus-cloud/shared/constants';
import { clubAthleticLabels, isClubAthletic } from '../clubs.athletics.labels';
import { AdminService, FileUploadService } from '@campus-cloud/shared/services';
import { configureTestSuite, CPTestModule } from '@projects/campus-cloud/src/app/shared/tests';

const mockClub = {
  name: 'mock name',
  logo_url: 'mock logo_url',
  status: 'mock status',
  has_membership: true,
  location: 'mock location',
  address: 'mock address',
  phone: 'mock phone',
  email: 'mock email',
  advisor_firstname: 'mock advisor_firstname',
  advisor_lastname: 'mock advisor_lastname',
  advisor_email: 'mock advisor_email'
};

const mockUser = {
  account_level_privileges: {
    1: {
      [CP_PRIVILEGES_MAP.clubs]: {
        r: true,
        w: true
      }
    }
  }
};

const mockSchool = {
  id: 157
};

class MockFileUploadService {
  validFile(_) {
    return true;
  }

  uploadFile() {
    return observableOf('mock_image');
  }
}

class MockClubsService {
  getClubById() {
    return observableOf(mockClub);
  }

  updateClub(clubData, clubId) {
    return observableOf({ clubData, clubId });
  }
}

class MockAdminService {
  getAdminByStoreId(search) {
    return observableOf(search);
  }
}

describe('ClubsInfoComponent', () => {
  configureTestSuite();
  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        imports: [CPTestModule, ClubsDetailsModule, RouterTestingModule.withRoutes([])],
        providers: [
          ClubsUtilsService,
          provideMockStore(),
          {
            provide: ActivatedRoute,
            useValue: {
              parent: {
                snapshot: {
                  params: {
                    clubId: 1
                  }
                }
              }
            }
          },
          { provide: FileUploadService, useClass: MockFileUploadService },
          { provide: ClubsService, useClass: MockClubsService },
          { provide: AdminService, useClass: MockAdminService }
        ]
      });
      await TestBed.compileComponents;
    })()
      .then(done)
      .catch(done.fail)
  );

  let comp: ClubsInfoComponent;
  let fixture: ComponentFixture<ClubsInfoComponent>;
  let clubSpy;
  let adminSpy;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ClubsInfoComponent);
    comp = fixture.componentInstance;

    comp.clubId = 1;
    comp.isAthletic = isClubAthletic.club;
    comp.labels = clubAthleticLabels(comp.isAthletic);
    comp.session.g.set('user', mockUser);
    comp.session.g.set('school', mockSchool);
    clubSpy = spyOn(comp.clubsService, 'getClubById').and.callThrough();
    adminSpy = spyOn(comp.adminService, 'getAdminByStoreId').and.callThrough();

    fixture.detectChanges();
  }));

  it('should fetch club', () => {
    expect(clubSpy).toHaveBeenCalledTimes(1);
  });

  it('should fetch admins', () => {
    expect(adminSpy).toHaveBeenCalledTimes(1);
  });
});
