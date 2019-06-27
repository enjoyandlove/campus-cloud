import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';

import * as fromStore from '../store';

import { CPSession } from '@campus-cloud/session';
import { configureTestSuite } from '@campus-cloud/shared/tests';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { mockSchool } from '../../../../../../session/mock';
import { mockIntegration, MockActivatedRoute, resetForm } from '../tests';
import { ItemsIntegrationEditComponent } from './integrations-edit.component';
import { CommonIntegrationUtilsService } from '@campus-cloud/libs/integrations/common/providers/integrations.utils.service';

describe('ItemsIntegrationEditComponent', () => {
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
        declarations: [ItemsIntegrationEditComponent],
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
  let component: ItemsIntegrationEditComponent;
  let fixture: ComponentFixture<ItemsIntegrationEditComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsIntegrationEditComponent);
    component = fixture.componentInstance;

    session = TestBed.get(CPSession);
    session.g.set('school', mockSchool);

    component.eventIntegration = mockIntegration;

    const closeButtonDebugEl = fixture.debugElement.query(By.css('.cpmodal__header__close'));

    const cancelButtonDebugEl = fixture.debugElement.query(By.css('.cpbtn--cancel'));

    closeButton = closeButtonDebugEl.nativeElement;
    cancelButton = cancelButtonDebugEl.nativeElement;

    fixture.detectChanges();

    tearDownSpy = spyOn(component.teardown, 'emit');
    formResetSpy = spyOn(component.form, 'reset');
  });

  it('should create', () => {
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

  it('should create an EventIntegration with the data pass as input', () => {
    expect(component.eventIntegration.id).toBe(mockIntegration.id);
  });

  it('should dispatch EditIntegration action', () => {
    component.ngOnInit();
    spyOn(component, 'resetModal');
    const dispatchSpy = spyOn(component.store, 'dispatch');

    component.doSubmit();

    const expected = new fromStore.EditIntegration(component.form.getRawValue());

    expect(component.resetModal).toHaveBeenCalled();
    expect(component.store.dispatch).toHaveBeenCalled();

    const { payload, type } = dispatchSpy.calls.mostRecent().args[0] as any;
    const { body, integrationId } = payload;

    expect(body).toEqual(expected.payload);
    expect(integrationId).toEqual(component.eventIntegration.id);
    expect(type).toEqual(fromStore.IntegrationActions.UPDATE_AND_SYNC);
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

  it('should mark non editable fields as disable', () => {
    const nonEditableFields = ['feed_url'];

    nonEditableFields.forEach((ctrlName) => {
      const disableSatus = component.form.get(ctrlName).disabled;

      expect(disableSatus).toBe(true);
    });
  });
});
