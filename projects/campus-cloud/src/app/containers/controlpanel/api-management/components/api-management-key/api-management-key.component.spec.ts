import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { By } from '@angular/platform-browser';

import { CPCopyClipboardDirective } from '@campus-cloud/shared/directives';
import { ApiManagementKeyComponent } from './api-management-key.component';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';
import { DebugElement } from '@angular/core';

describe('ApiManagementKeyComponent', () => {
  configureTestSuite();

  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        declarations: [ApiManagementKeyComponent],
        providers: [provideMockStore()],
        imports: [CPTestModule]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let de: DebugElement;
  let inputEl: HTMLInputElement;
  let visibilityToggleBtn: HTMLButtonElement;
  let fixture: ComponentFixture<ApiManagementKeyComponent>;
  let component: ApiManagementKeyComponent;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ApiManagementKeyComponent);
    component = fixture.componentInstance;

    component.key = 'live_qB23EwdDrFtdfG4G5Re0LlsaqWe34R5f';
    de = fixture.debugElement;
    fixture.detectChanges();
  }));

  describe('api key button wrapper', () => {
    let btn: DebugElement;

    beforeEach(() => {
      btn = de.query(By.css('button.item__key-container'));
    });

    it('should have cpCopyClipboard directive', () => {
      expect(de.query(By.directive(CPCopyClipboardDirective))).not.toBe(null);
      expect(btn === de.query(By.directive(CPCopyClipboardDirective))).toBe(true);
    });

    it('should call notify on click', () => {
      spyOn(component, 'notify');
      btn.nativeElement.click();
      expect(component.notify).toHaveBeenCalled();
    });
  });

  describe('visibility toggle button', () => {
    beforeEach(() => {
      visibilityToggleBtn = de.query(By.css('button.item__visibility-icon')).nativeElement;
    });

    it('should toggle isTextVisible on button click', () => {
      component.isTextVisible = true;
      fixture.detectChanges();

      visibilityToggleBtn.click();
      fixture.detectChanges();

      expect(component.isTextVisible).toBe(false);

      visibilityToggleBtn.click();
      fixture.detectChanges();

      expect(component.isTextVisible).toBe(true);
    });
  });

  describe('input element', () => {
    beforeEach(() => {
      inputEl = de.query(By.css('input.item__key-input')).nativeElement;
    });

    it('should be disabled', () => {
      expect(inputEl.disabled).toBe(true);
    });

    it('should set type attribute to text when isTextVisible is true', () => {
      component.isTextVisible = true;
      fixture.detectChanges();

      expect(inputEl.type).toBe('text');
    });

    it('should set type attribute to password when isTextVisible is true', () => {
      component.isTextVisible = false;
      fixture.detectChanges();

      expect(inputEl.type).toBe('password');
    });
  });
});
