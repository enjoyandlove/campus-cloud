import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { CPSession } from '@campus-cloud/session';
import { ClubsFormComponent } from './clubs-form.component';
import { mockSchool } from '@campus-cloud/session/mock/school';
import { ClubStatus } from '@controlpanel/manage/clubs/club.status';
import { ClubsModel } from '@controlpanel/manage/clubs/model/clubs.model';
import { ClubsUtilsService } from '@controlpanel/manage/clubs/clubs.utils.service';
import { configureTestSuite, CPTestModule, MOCK_IMAGE } from '@campus-cloud/shared/tests';

describe('ClubsFormComponent', () => {
  configureTestSuite();

  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        declarations: [ClubsFormComponent],
        providers: [ClubsUtilsService],
        imports: [CPTestModule],
        schemas: [NO_ERRORS_SCHEMA]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let session;
  let fixture: ComponentFixture<ClubsFormComponent>;
  let component: ClubsFormComponent;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ClubsFormComponent);
    component = fixture.componentInstance;

    component.school = mockSchool;
    session = TestBed.get(CPSession);
    session.g.set('school', mockSchool);
    component.form = ClubsModel.form(false);
  }));

  it('should upload image', () => {
    component.onUploadedImage(MOCK_IMAGE);

    expect(component.form.get('logo_url').value).toEqual(MOCK_IMAGE);
  });

  it('should select club status', () => {
    const status = {
      action: ClubStatus.active
    };
    component.onSelectedStatus(status);

    expect(component.form.get('status').value).toEqual(ClubStatus.active);
  });

  it('should select club membership', () => {
    const membership = {
      action: true
    };
    component.onSelectedMembership(membership);

    expect(component.form.get('has_membership').value).toBe(true);
  });

  it('should show/hide location details & set address required/optional onLocationToggle ', () => {
    component.onLocationToggle(true);

    expect(component.showLocationDetails).toBe(true);
    expect(component.form.get('address').invalid).toBe(true);

    // reset location
    component.onLocationToggle(false);

    expect(component.drawMarker.value).toBe(false);
    expect(component.showLocationDetails).toBe(false);
    expect(component.form.get('address').invalid).toBe(false);
    expect(component.form.controls['room_info'].value).toBe('');
    expect(component.mapCenter.value.lat).toEqual(mockSchool.latitude);
    expect(component.mapCenter.value.lng).toEqual(mockSchool.latitude);
  });
});
