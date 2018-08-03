import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { of as observableOf } from 'rxjs';

import { ClubsService } from './../clubs.service';
import { CPSession } from './../../../../../session';
import { ClubsInfoComponent } from './clubs-info.component';
import { ClubsUtilsService } from './../clubs.utils.service';
import { ClubsDetailsModule } from './../details/details.module';
import { CPTrackingService } from '../../../../../shared/services';
import { CPI18nService } from './../../../../../shared/services/i18n.service';
import { clubAthleticLabels, isClubAthletic } from '../clubs.athletics.labels';
import { CP_PRIVILEGES_MAP } from './../../../../../shared/constants/privileges';
import { FileUploadService } from './../../../../../shared/services/file-upload.service';

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

describe('ClubsInfoComponent', () => {
  let comp: ClubsInfoComponent;
  let fixture: ComponentFixture<ClubsInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClubsDetailsModule, RouterTestingModule.withRoutes([]), StoreModule.forRoot({})],
      providers: [
        CPI18nService,
        ClubsUtilsService,
        CPTrackingService,
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
        { provide: FileUploadService, useValue: new MockFileUploadService() },
        { provide: ClubsService, useValue: new MockClubsService() },
        { provide: CPSession, useValue: new CPSession() }
      ]
    });

    fixture = TestBed.createComponent(ClubsInfoComponent);
    comp = fixture.componentInstance;

    comp.clubId = 1;
    comp.isAthletic = isClubAthletic.club;
    comp.labels = clubAthleticLabels(comp.isAthletic);
    comp.session.g.set('user', mockUser);
    comp.session.g.set('school', mockSchool);
  });

  it(
    'async',
    fakeAsync(() => {
      comp.limitedAdmin = false;

      expect(comp.club).toBeUndefined();
      expect(comp.loading).toBeUndefined();

      comp.fetch();

      tick();

      // fixture.detectChanges();
      expect(comp.loading).not.toBeUndefined();

      tick();

      expect(comp.club).toBe(mockClub);
      expect(comp.hasMetaData).toBeTruthy();
    })
  );
});
