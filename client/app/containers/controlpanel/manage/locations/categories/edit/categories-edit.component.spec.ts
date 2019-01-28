import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';

import * as fromStore from '../store';
import { CPSession } from '@app/session';
import { CPI18nService } from '@shared/services';
import { configureTestSuite } from '@shared/tests';
import { SharedModule } from '@shared/shared.module';
import { mockSchool } from '@app/session/mock/school';
import { filledForm, mockCategories } from '../tests';
import { CategoriesEditComponent } from './categories-edit.component';

describe('CategoriesEditComponent', () => {
  configureTestSuite();

  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        imports: [SharedModule, StoreModule.forRoot({})],
        providers: [CPSession, CPI18nService],
        declarations: [CategoriesEditComponent],
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
  let component: CategoriesEditComponent;
  let fixture: ComponentFixture<CategoriesEditComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriesEditComponent);
    component = fixture.componentInstance;
    component.session.g.set('school', mockSchool);
    component.category = mockCategories[0];

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

  it('should create form with values', () => {
    const result = component.form.value;
    expect(result).toEqual(filledForm);
  });

  it('should show form errors true', () => {
    component.form.get('name').setValue(null);

    component.doSubmit();

    expect(component.formError).toBe(true);
    expect(component.form.valid).toBe(false);
  });

  it('should dispatch EditCategory action', () => {
    spyOn(component, 'resetModal');
    const dispatchSpy = spyOn(component.store, 'dispatch');

    component.doSubmit();

    const expected = new fromStore.EditCategory(component.form.value);

    expect(component.resetModal).toHaveBeenCalled();
    expect(component.store.dispatch).toHaveBeenCalled();

    const { payload, type } = dispatchSpy.calls.mostRecent().args[0];
    const { body, categoryId } = payload;

    expect(body).toEqual(expected.payload);
    expect(categoryId).toEqual(component.category.id);
    expect(type).toEqual(fromStore.CategoriesActions.EDIT_CATEGORY);
  });
});
