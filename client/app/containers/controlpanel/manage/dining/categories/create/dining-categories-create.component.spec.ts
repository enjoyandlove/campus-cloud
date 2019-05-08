import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';

import * as fromStore from '../store';
import { CPSession } from '@app/session';
import { fillForm } from '@shared/utils/tests';
import { CPI18nService } from '@shared/services';
import { MODAL_DATA } from '@app/shared/services';
import { configureTestSuite } from '@shared/tests';
import { SharedModule } from '@shared/shared.module';
import { mockSchool } from '@app/session/mock/school';
import { LocationsUtilsService } from '@libs/locations/common/utils';
import { LocationsTimeLabelPipe } from '@libs/locations/common/pipes';
import { DiningCategoriesCreateComponent } from './dining-categories-create.component';
import { emptyForm, filledForm, MockModalData } from '@libs/locations/common/categories/tests';

describe('DiningCategoriesCreateComponent', () => {
  configureTestSuite();

  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        imports: [SharedModule, StoreModule.forRoot({})],
        providers: [
          CPSession,
          CPI18nService,
          LocationsUtilsService,
          LocationsTimeLabelPipe,
          { provide: MODAL_DATA, useClass: MockModalData }
        ],
        declarations: [DiningCategoriesCreateComponent],
        schemas: [NO_ERRORS_SCHEMA]
      });

      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail)
  );

  let closeButton: HTMLSpanElement;
  let cancelButton: HTMLButtonElement;
  let component: DiningCategoriesCreateComponent;
  let fixture: ComponentFixture<DiningCategoriesCreateComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DiningCategoriesCreateComponent);
    component = fixture.componentInstance;
    component.session.g.set('school', mockSchool);

    const closeButtonDebugEl = fixture.debugElement.query(By.css('.cpmodal__header__close'));

    const cancelButtonDebugEl = fixture.debugElement.query(By.css('.cpbtn--cancel'));

    closeButton = closeButtonDebugEl.nativeElement;
    cancelButton = cancelButtonDebugEl.nativeElement;

    fixture.detectChanges();
  });

  it('should init', () => {
    expect(component).toBeTruthy();
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

    const { payload, type } = dispatchSpy.calls.mostRecent().args[0];
    const { body } = payload;

    expect(body).toEqual(expected.payload);
    expect(type).toEqual(fromStore.CategoriesActions.POST_CATEGORY);
  });
});
