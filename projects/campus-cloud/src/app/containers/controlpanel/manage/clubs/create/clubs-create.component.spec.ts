import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { provideMockStore } from '@ngrx/store/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';

import { CPSession } from '@campus-cloud/session';
import { mockClub } from '@controlpanel/manage/clubs/tests';
import { fillForm } from '@campus-cloud/shared/utils/tests';
import { mockSchool } from '@campus-cloud/session/mock/school';
import { ClubsCreateComponent } from './clubs-create.component';
import { ClubsService } from '@controlpanel/manage/clubs/clubs.service';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';
import { ClubsUtilsService } from '@controlpanel/manage/clubs/clubs.utils.service';

describe('ClubsCreateComponent', () => {
  configureTestSuite();

  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        declarations: [ClubsCreateComponent],
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
  let fixture: ComponentFixture<ClubsCreateComponent>;
  let component: ClubsCreateComponent;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ClubsCreateComponent);
    component = fixture.componentInstance;

    session = TestBed.get(CPSession);
    session.g.set('school', mockSchool);

    spyOn(component, 'trackEvent');
    spyOn(component, 'handleError');
    spyOn(component.router, 'navigate');

    fixture.detectChanges();
  }));

  it('form validation should fail required fields missing', () => {
    const errorMessage = component.cpI18n.translate('error_fill_out_marked_fields');

    component.onSubmit();

    expect(component.formError).toBe(true);
    expect(component.form.valid).toBe(false);
    expect(component.buttonData.disabled).toBe(false);
    expect(component.handleError).toHaveBeenCalledWith(errorMessage);
  });

  it('should create club error', () => {
    const error = throwError(new HttpErrorResponse({ error: 'error' }));
    spy = spyOn(component.clubsService, 'createClub').and.returnValue(error);
    const errorMessage = component.cpI18n.translate('something_went_wrong');

    fillForm(component.form, mockClub);

    component.onSubmit();

    expect(spy).toHaveBeenCalled();
    expect(component.form.valid).toBe(true);
    expect(component.formError).toBe(false);
    expect(component.handleError).toHaveBeenCalled();
    expect(component.router.navigate).not.toHaveBeenCalled();
    expect(component.handleError).toHaveBeenCalledWith(errorMessage);
  });

  it('should create club success', () => {
    spy = spyOn(component.clubsService, 'createClub').and.returnValue(of({}));
    fillForm(component.form, mockClub);

    component.onSubmit();

    expect(spy).toHaveBeenCalled();
    expect(component.form.valid).toBe(true);
    expect(component.formError).toBe(false);
    expect(component.trackEvent).toHaveBeenCalled();
    expect(component.router.navigate).toHaveBeenCalled();
  });
});
