import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { of as observableOf } from 'rxjs';

import { MembersService } from '../members.service';
import { CPSession } from "../../../../../../session";
import { ClubsMembersModule } from '../members.module';
import { ClubsMembersComponent } from './list.component';
import { ClubsUtilsService } from '../../clubs.utils.service';
import { MembersUtilsService } from '../members.utils.service';
import { CPI18nService, CPTrackingService } from '../../../../../../shared/services';

class MockMembersService {
  getSocialGroupDetails() {
    return observableOf({});
  }
  getMembers() {
    return observableOf({});
  }
}

class MockClubUtilsService {
  limitedAdmin() {
    return false;
  }
}

const mockRoute = { snapshot: { parent: { parent: { parent: { params: { clubId: 0 } } } } } };

describe('ClubsMembersComponent', () => {
  let component: ClubsMembersComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ClubsMembersModule,
        RouterTestingModule
      ],
      providers: [
        CPSession,
        CPI18nService,
        CPTrackingService,
        MembersUtilsService,
        ClubsMembersComponent,
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: MembersService, useClass: MockMembersService },
        { provide: ClubsUtilsService, useClass: MockClubUtilsService}
      ]
    });
    component = TestBed.get(ClubsMembersComponent);
  });

  it('should set showStudentIds true', () => {
    component.session.g.set('user', {
      school_level_privileges: { 157: { 22: {r: true, w: true} } }
    });
    component.session.g.set('school', {
      id: 157,
      has_sso_integration: true
    });
    component.ngOnInit();
    expect(component.showStudentIds).toBe(true);
  });

  it('should set showStudentIds false if hasSSO is false', () => {
    component.session.g.set('user', {
      school_level_privileges: { 157: { 22: {r: true, w: true} } }
    });
    component.session.g.set('school', {
      id: 157,
      has_sso_integration: false
    });
    component.ngOnInit();
    expect(component.showStudentIds).toBe(false);
  });

  it('should set showStudentIds false if school id != user school privileges', () => {
    component.session.g.set('user', {
      school_level_privileges: { 157: { 22: {r: true, w: true} } }
    });
    component.session.g.set('school', {
      id: 0,
      has_sso_integration: true
    });
    component.ngOnInit();
    expect(component.showStudentIds).toBe(false);
  });

  it('should set showStudentIds false if user has no school privileges', () => {
    component.session.g.set('user', {});
    component.session.g.set('school', {
      id: 157,
      has_sso_integration: true
    });
    component.ngOnInit();
    expect(component.showStudentIds).toBe(false);
  });
});
