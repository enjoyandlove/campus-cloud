import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CPI18nService } from '@campus-cloud/shared/services';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { configureTestSuite } from '@campus-cloud/shared/tests';
import { CPDeleteModalComponent } from './cp-delete-modal.component';
import { CPCheckboxComponent } from './../cp-checkbox/cp-checkbox.component';

describe('CPDeleteModalComponent', () => {
  configureTestSuite();

  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        providers: [CPI18nService],
        imports: [SharedModule]
      });

      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail)
  );

  let component: CPDeleteModalComponent;
  let fixture: ComponentFixture<CPDeleteModalComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CPDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call resetModal on x button click', () => {
    const cancelEmit = spyOn(component.cancelClick, 'emit');

    const de = fixture.debugElement;
    const closeButton: HTMLElement = de.query(By.css('.cpmodal__header__close')).nativeElement;
    closeButton.click();

    expect(cancelEmit).toHaveBeenCalled();
  });

  it('should call resetModal on cancel button click', () => {
    const resetModalSpy = spyOn(component, 'resetModal');

    const de = fixture.debugElement;
    const closeButton: HTMLElement = de.query(By.css('.js_cancel_button')).nativeElement;
    closeButton.click();

    expect(resetModalSpy).toHaveBeenCalled();
  });

  it('should emit cancelEvent', () => {
    const cancelEmit = spyOn(component.cancelClick, 'emit');
    component.resetModal();

    expect(cancelEmit).toHaveBeenCalled();
  });

  it('should emit deleteClick', () => {
    const deleteEmit = spyOn(component.deleteClick, 'emit');
    component.onDeleteClick();

    expect(deleteEmit).toHaveBeenCalled();
  });

  it('should call onDeleteClick on delete button click', () => {
    const deleteEmit = spyOn(component.deleteClick, 'emit');
    const de = fixture.debugElement;
    const closeButton: HTMLElement = de.query(By.css('.js_delete_button')).nativeElement;
    closeButton.click();

    expect(deleteEmit).toHaveBeenCalled();
  });

  it('should render modalBody in modal body', () => {
    const modalBody = 'content';
    component.modalBody = modalBody;

    fixture.detectChanges();

    const de = fixture.debugElement;
    const bodyPTag: HTMLParagraphElement = de.query(By.css('.js_body')).nativeElement;

    expect(bodyPTag.innerHTML).toContain(modalBody);
  });

  it('should render modalTitle in modal title', () => {
    const modalTitle = 'content';
    component.modalTitle = modalTitle;

    fixture.detectChanges();

    const de = fixture.debugElement;
    const bodyPTag: HTMLElement = de.query(By.css('.js_title')).nativeElement;

    expect(bodyPTag.innerHTML).toContain(modalTitle);
  });

  it('should set disableSubmit to false if no warning inputs are passed', () => {
    expect(component.disableSubmit).toBe(false);
  });

  describe('with warning input', () => {
    beforeEach(() => {
      component.warnings = ['some', 'random', 'input'];
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should set disableSubmit to true if warning inputs are passed', () => {
      expect(component.disableSubmit).toBe(true);
    });

    it('should render warnings on the template', () => {
      const warningItems = fixture.debugElement.queryAll(By.css('.cpmodal__body__warning__item'));
      expect(warningItems.length).toBe(component._warnings.length);
    });

    it('should set disableStatus when all warnings are checked', () => {
      const warningItems: DebugElement[] = fixture.debugElement.queryAll(
        By.css('.cpmodal__body__warning__item')
      );

      expect(component.disableSubmit).toBe(true);

      warningItems.forEach((i) => {
        const checkbox: CPCheckboxComponent = i.query(By.directive(CPCheckboxComponent))
          .componentInstance;
        checkbox.toggle.emit(true);
        fixture.detectChanges();
      });

      expect(component.disableSubmit).toBe(false);
    });
  });
});
