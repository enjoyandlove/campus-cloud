import { Observable } from 'rxjs/Observable';
import { ClubsService } from './../clubs.service';
import { ClubsUtilsService } from './../clubs.utils.service';
import { CPI18nService } from './../../../../../shared/services/i18n.service';
import { CPSession } from './../../../../../session/index';
import { StoreModule } from '@ngrx/store';
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { ClubsModule } from './../clubs.module';
import { ClubsEditComponent } from './clubs-edit.component';
import { CP_PRIVILEGES_MAP } from '../../../../../shared/constants';
import { isClubAthletic } from '../clubs.athletics.labels';
import { get as _get } from 'lodash';

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

let mockUser = {
  school_level_privileges: {
    157: {
      [CP_PRIVILEGES_MAP.clubs]: {
        r: true,
        w: true
      }
    }
  },
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

class MockClubsService {
  getClubById() {
    return Observable.of(mockClub);
  }
}

describe('ClubsEditComponent', () => {
  let comp: ClubsEditComponent;
  let fixture: ComponentFixture<ClubsEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClubsModule, RouterTestingModule.withRoutes([]), StoreModule.forRoot({})],
      providers: [
        CPI18nService,
        ClubsUtilsService,
        { provide: ClubsService, useValue: new MockClubsService() },
        { provide: CPSession, useValue: new CPSession() }
      ]
    });

    fixture = TestBed.createComponent(ClubsEditComponent);
    comp = fixture.componentInstance;

    comp.clubId = 1;
    comp.session.g.set('user', mockUser);
    comp.session.g.set('school', mockSchool);
  });

  it('limitedAdmin', () => {
    // default
    expect(comp.limitedAdmin).toBeTruthy();

    // if athetlic club
    comp.isAthletic = isClubAthletic.athletic;
    fixture.detectChanges();
    expect(comp.limitedAdmin).toBeFalsy();

    // club with mockUser privileges
    comp.isAthletic = isClubAthletic.club;
    comp.ngOnInit();
    fixture.detectChanges();
    expect(comp.limitedAdmin).toBeFalsy();

    mockUser = {
      school_level_privileges: {
        157: {
          [CP_PRIVILEGES_MAP.clubs]: {
            r: true,
            w: false
          }
        }
      },
      account_level_privileges: {
        1: {
          [CP_PRIVILEGES_MAP.clubs]: {
            r: true,
            w: false
          }
        }
      }
    };
    comp.session.g.set('user', mockUser);
    comp.ngOnInit();
    fixture.detectChanges();
    expect(comp.limitedAdmin).toBeTruthy();
  });

  it('Form Inputs are disabled if limited access', () => {
    let formValueName;
    let formValueStatus;
    let formValueAdvisorFirstName;
    let formValueAdvisorLastName;
    let formValueAdvisorEmail;

    fixture.detectChanges();
    comp.club = mockClub;

    comp.buildForm();

    formValueName = _get(comp.form.value, 'name', undefined);
    formValueStatus = _get(comp.form.value, 'status', undefined);
    formValueAdvisorFirstName = _get(comp.form.value, 'advisor_firstname', undefined);
    formValueAdvisorLastName = _get(comp.form.value, 'advisor_lastname', undefined);
    formValueAdvisorEmail = _get(comp.form.value, 'advisor_email', undefined);

    expect(formValueName).toBeUndefined();
    expect(formValueStatus).toBeUndefined();
    expect(formValueAdvisorFirstName).toBeUndefined();
    expect(formValueAdvisorLastName).toBeUndefined();
    expect(formValueAdvisorEmail).toBeUndefined();

    comp.limitedAdmin = false;
    comp.buildForm();

    formValueName = _get(comp.form.value, 'name', undefined);
    formValueStatus = _get(comp.form.value, 'status', undefined);
    formValueAdvisorFirstName = _get(comp.form.value, 'advisor_firstname', undefined);
    formValueAdvisorLastName = _get(comp.form.value, 'advisor_lastname', undefined);
    formValueAdvisorEmail = _get(comp.form.value, 'advisor_email', undefined);

    expect(formValueName).toBeDefined();
    expect(formValueName).toBe('mock name');
    expect(formValueStatus).toBeDefined();
    expect(formValueStatus).toBe('mock status');
    expect(formValueAdvisorFirstName).toBeDefined();
    expect(formValueAdvisorFirstName).toBe('mock advisor_firstname');
    expect(formValueAdvisorLastName).toBeDefined();
    expect(formValueAdvisorLastName).toBe('mock advisor_lastname');
    expect(formValueAdvisorEmail).toBeDefined();
    expect(formValueAdvisorEmail).toBe('mock advisor_email');
  });
});
