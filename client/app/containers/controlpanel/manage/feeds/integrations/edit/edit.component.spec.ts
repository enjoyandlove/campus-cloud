import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { omit } from 'lodash';

import * as fromStore from '../store';

import { CPSession } from '@app/session';
import { configureTestSuite } from '@shared/tests';
import { CPI18nService } from '@app/shared/services';
import { SharedModule } from '@shared/shared.module';
import { mockSchool } from '@app/session/mock/school';
import { WallsIntegrationsEditComponent } from './edit.component';
import { WallsIntegrationsService } from '../walls-integrations.service';
import { fillForm, resetForm, MockWallsIntegrationsService, mockIntegration } from '../tests';
import { CommonIntegrationUtilsService } from '@libs/integrations/common/providers/integrations.utils.service';

describe('WallsIntegrationsEditComponent', () => {
  configureTestSuite();

  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        imports: [SharedModule, StoreModule.forRoot({})],
        providers: [
          CPSession,
          CommonIntegrationUtilsService,
          CPI18nService,
          {
            provide: WallsIntegrationsService,
            useClass: MockWallsIntegrationsService
          }
        ],
        declarations: [WallsIntegrationsEditComponent],
        schemas: [NO_ERRORS_SCHEMA]
      });

      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail)
  );

  let session: CPSession;
  let tearDownSpy: jasmine.Spy;
  let formResetSpy: jasmine.Spy;
  let closeButton: HTMLSpanElement;
  let cancelButton: HTMLButtonElement;
  let component: WallsIntegrationsEditComponent;

  let fixture: ComponentFixture<WallsIntegrationsEditComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WallsIntegrationsEditComponent);
    component = fixture.componentInstance;

    session = TestBed.get(CPSession);

    session.g.set('school', mockSchool);

    const closeButtonDebugEl = fixture.debugElement.query(By.css('.cpmodal__header__close'));

    const cancelButtonDebugEl = fixture.debugElement.query(By.css('.cpbtn--cancel'));

    closeButton = closeButtonDebugEl.nativeElement;
    cancelButton = cancelButtonDebugEl.nativeElement;

    component.integration = mockIntegration;

    fixture.detectChanges();

    tearDownSpy = spyOn(component.teardown, 'emit');
    formResetSpy = spyOn(component.form, 'reset');
  });

  it('should init', () => {
    expect(component).toBeTruthy();
  });

  it('should emit teardown event on reset', () => {
    component.resetModal();
    expect(tearDownSpy).toHaveBeenCalled();
    expect(formResetSpy).toHaveBeenCalled();
  });

  it('should call resetModal on close button click', () => {
    spyOn(component, 'resetModal');

    closeButton.click();

    expect(component.resetModal).toHaveBeenCalled();
  });

  it('should call resetModal on cancel button click', () => {
    spyOn(component, 'resetModal');

    cancelButton.click();

    expect(component.resetModal).toHaveBeenCalled();
  });

  it('should create form with values form integration input', () => {
    component.ngOnInit();

    const result = component.form.value;

    // remove readonly fields
    const expected = omit(component.integration, [
      'id',
      'sync_status',
      'last_successful_sync_epoch'
    ]);
    expect(result).toEqual(expected);
  });

  it('should dispatch EditIntegration action', () => {
    component.ngOnInit();
    spyOn(component, 'resetModal');
    const dispatchSpy = spyOn(component.store, 'dispatch');
    fillForm(component.form);

    component.doSubmit();

    const expected = new fromStore.EditIntegration(component.form.value);

    expect(component.resetModal).toHaveBeenCalled();
    expect(component.store.dispatch).toHaveBeenCalled();

    const { payload, type } = dispatchSpy.calls.mostRecent().args[0];
    const { body } = payload;

    expect(body).toEqual(expected.payload);
    expect(type).toEqual(fromStore.IntegrationActions.EDIT_INTEGRATION);
  });

  it('submit button should be disabled unless form is valid', () => {
    const de = fixture.debugElement;
    const submitBtn = de.query(By.css('.js_submit_button')).nativeElement;

    resetForm(component.form);
    fixture.detectChanges();

    expect(submitBtn.disabled).toBe(true);

    component.form.get('school_id').setValue(1);
    fixture.detectChanges();
    expect(submitBtn.disabled).toBe(true);

    component.form.get('feed_url').setValue('mock');
    fixture.detectChanges();
    expect(submitBtn.disabled).toBe(true);
  });
});
