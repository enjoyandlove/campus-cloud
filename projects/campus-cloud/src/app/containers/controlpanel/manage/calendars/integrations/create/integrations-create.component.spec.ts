import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';

import * as fromStore from '../store';

import { CPSession } from '@campus-cloud/session';
import { configureTestSuite } from '@campus-cloud/shared/tests';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { mockSchool } from '@campus-cloud/session/mock/school';
import { EventIntegration } from '@campus-cloud/libs/integrations/events/model';
import { emptyForm, fillForm, MockActivatedRoute, resetForm } from '../tests';
import { ItemsIntegrationsCreateComponent } from './integrations-create.component';
import { CommonIntegrationUtilsService } from '@campus-cloud/libs/integrations/common/providers/integrations.utils.service';

describe('ItemsIntegrationsCreateComponent', () => {
  configureTestSuite();

  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        imports: [SharedModule, StoreModule.forRoot({})],
        providers: [
          CPSession,
          CommonIntegrationUtilsService,
          { provide: ActivatedRoute, useClass: MockActivatedRoute }
        ],
        declarations: [ItemsIntegrationsCreateComponent],
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
  let component: ItemsIntegrationsCreateComponent;

  let fixture: ComponentFixture<ItemsIntegrationsCreateComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsIntegrationsCreateComponent);
    component = fixture.componentInstance;

    session = TestBed.get(CPSession);

    session.g.set('school', mockSchool);

    const closeButtonDebugEl = fixture.debugElement.query(By.css('.cpmodal__header__close'));

    const cancelButtonDebugEl = fixture.debugElement.query(By.css('.cpbtn--cancel'));

    closeButton = closeButtonDebugEl.nativeElement;
    cancelButton = cancelButtonDebugEl.nativeElement;

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

  it('should create an empty form', () => {
    component.ngOnInit();

    const expected = component.form.value;
    const result = {
      ...emptyForm,
      // mock calendarId;
      feed_obj_id: 1,
      feed_type: EventIntegration.types.ical
    };
    expect(expected).toEqual(result);
  });

  it('should dispatch CreateAndSync action', () => {
    component.ngOnInit();
    spyOn(component, 'resetModal');
    const dispatchSpy = spyOn(component.store, 'dispatch');

    fillForm(component.form);

    component.doSubmit();

    const expected = new fromStore.CreateAndSync(component.form.value);

    expect(component.resetModal).toHaveBeenCalled();
    expect(component.store.dispatch).toHaveBeenCalled();

    const { payload, type } = dispatchSpy.calls.mostRecent().args[0] as any;
    const { body } = payload;

    expect(body).toEqual(expected.payload);
    expect(type).toEqual(fromStore.IntegrationActions.CREATE_AND_SYNC);
  });

  it('submit button should be disabled unless form is valid', () => {
    const de = fixture.debugElement;
    const submitBtn = de.query(By.css('.js_submit_button')).nativeElement;

    resetForm(component.form);

    expect(submitBtn.disabled).toBe(true);

    component.form.get('school_id').setValue(1);
    fixture.detectChanges();
    expect(submitBtn.disabled).toBe(true);

    component.form.get('feed_obj_id').setValue(1);
    fixture.detectChanges();
    expect(submitBtn.disabled).toBe(true);

    component.form.get('feed_url').setValue('mock');
    fixture.detectChanges();
    expect(submitBtn.disabled).toBe(true);

    component.form.get('feed_type').setValue(1);
    fixture.detectChanges();
    expect(submitBtn.disabled).toBe(false);
  });
});
