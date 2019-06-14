import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';

import * as fromStore from '../store';
import { CPSession } from '@campus-cloud/session';
import { fillForm } from '@campus-cloud/shared/utils/tests';
import { CPI18nService } from '@campus-cloud/shared/services';
import { configureTestSuite } from '@campus-cloud/shared/tests';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { mockSchool } from '@campus-cloud/session/mock/school';
import { LocationsUtilsService } from '@campus-cloud/libs/locations/common/utils';
import { LocationsTimeLabelPipe } from '@campus-cloud/libs/locations/common/pipes';
import { CategoriesCreateComponent } from './categories-create.component';
import { emptyForm, filledForm } from '@campus-cloud/libs/locations/common/categories/tests';

describe('CategoriesCreateComponent', () => {
  configureTestSuite();

  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        imports: [SharedModule, StoreModule.forRoot({})],
        providers: [CPSession, CPI18nService, LocationsTimeLabelPipe, LocationsUtilsService],
        declarations: [CategoriesCreateComponent],
        schemas: [NO_ERRORS_SCHEMA]
      });

      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail)
  );

  let tearDownSpy: jasmine.Spy;
  let formResetSpy: jasmine.Spy;
  let closeButton: HTMLSpanElement;
  let cancelButton: HTMLButtonElement;
  let component: CategoriesCreateComponent;
  let fixture: ComponentFixture<CategoriesCreateComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriesCreateComponent);
    component = fixture.componentInstance;
    component.session.g.set('school', mockSchool);

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
    expect(tearDownSpy).toHaveBeenCalledTimes(1);
    expect(formResetSpy).toHaveBeenCalledTimes(1);
  });

  it('should call resetModal on close button click', () => {
    spyOn(component, 'resetModal');

    closeButton.click();

    expect(component.resetModal).toHaveBeenCalled();
    expect(component.resetModal).toHaveBeenCalledTimes(1);
  });

  it('should call resetModal on cancel button click', () => {
    spyOn(component, 'resetModal');

    cancelButton.click();

    expect(component.resetModal).toHaveBeenCalled();
    expect(component.resetModal).toHaveBeenCalledTimes(1);
  });

  it('should create an empty form', () => {
    const result = component.form.value;
    expect(result).toEqual(emptyForm);
  });

  it('should show form errors true', () => {
    component.doSubmit();

    expect(component.formError).toBe(true);
    expect(component.form.valid).toBe(false);
  });

  it('should dispatch PostCategory action', () => {
    spyOn(component, 'resetModal');
    const dispatchSpy = spyOn(component.store, 'dispatch');

    fillForm(component.form, filledForm);

    component.doSubmit();

    const expected = new fromStore.PostCategory(component.form.value);

    expect(component.resetModal).toHaveBeenCalled();
    expect(component.store.dispatch).toHaveBeenCalled();

    const { payload, type } = dispatchSpy.calls.mostRecent().args[0] as any;
    const { body } = payload;

    expect(body).toEqual(expected.payload);
    expect(type).toEqual(fromStore.CategoriesActions.POST_CATEGORY);
  });
});
