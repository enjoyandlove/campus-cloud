import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { provideMockStore } from '@ngrx/store/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';

import { CPSession } from '@campus-cloud/session';
import { mockUser } from '@campus-cloud/session/mock';
import { ClubsEditComponent } from './clubs-edit.component';
import { mockClub } from '@controlpanel/manage/clubs/tests';
import { mockSchool } from '@campus-cloud/session/mock/school';
import { ClubsService } from '@controlpanel/manage/clubs/clubs.service';
import { ClubsModel } from '@controlpanel/manage/clubs/model/clubs.model';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';
import { ClubsUtilsService } from '@controlpanel/manage/clubs/clubs.utils.service';

describe('ClubsEditComponent', () => {
  configureTestSuite();

  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        declarations: [ClubsEditComponent],
        providers: [ClubsService, ClubsUtilsService, provideMockStore()],
        imports: [CPTestModule],
        schemas: [NO_ERRORS_SCHEMA]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let spy;
  let session;
  let fixture: ComponentFixture<ClubsEditComponent>;
  let component: ClubsEditComponent;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ClubsEditComponent);
    component = fixture.componentInstance;

    component.clubId = 123;
    session = TestBed.get(CPSession);
    session.g.set('user', mockUser);
    session.g.set('school', mockSchool);

    spyOn(component, 'trackEvent');
    spyOn(component, 'handleError');
    spyOn(component.router, 'navigate');
    component.form = ClubsModel.form(false, mockClub);
    spyOn(component.clubsService, 'getClubById').and.returnValue(of(mockClub));

    fixture.detectChanges();
  }));

  it('form validation should fail required fields missing', () => {
    const errorMessage = component.cpI18n.translate('error_fill_out_marked_fields');

    component.form.get('name').setValue(null);

    component.onSubmit();

    expect(component.formError).toBe(true);
    expect(component.form.valid).toBe(false);
    expect(component.buttonData.disabled).toBe(false);
    expect(component.handleError).toHaveBeenCalledWith(errorMessage);
  });

  it('form validation should fail required fields for SJSU', () => {
    const errorMessage = component.cpI18n.translate('error_fill_out_marked_fields');

    component.form.get('advisor_firstname').setValue(null);

    component.onSubmit();

    expect(component.formError).toBe(true);
    expect(component.form.valid).toBe(false);
    expect(component.buttonData.disabled).toBe(false);
    expect(component.handleError).toHaveBeenCalledWith(errorMessage);
  });

  it('should edit club error', () => {
    const error = throwError(new HttpErrorResponse({ error: 'error' }));
    spy = spyOn(component.clubsService, 'updateClub').and.returnValue(error);
    const errorMessage = component.cpI18n.translate('something_went_wrong');

    component.onSubmit();

    expect(spy).toHaveBeenCalled();
    expect(component.form.valid).toBe(true);
    expect(component.formError).toBe(false);
    expect(component.handleError).toHaveBeenCalled();
    expect(component.router.navigate).not.toHaveBeenCalled();
    expect(component.handleError).toHaveBeenCalledWith(errorMessage);
  });

  it('should edit club success', () => {
    spy = spyOn(component.clubsService, 'updateClub').and.returnValue(of({}));

    component.onSubmit();

    expect(spy).toHaveBeenCalled();
    expect(component.form.valid).toBe(true);
    expect(component.formError).toBe(false);
    expect(component.trackEvent).toHaveBeenCalled();
    expect(component.router.navigate).toHaveBeenCalled();
  });
});
