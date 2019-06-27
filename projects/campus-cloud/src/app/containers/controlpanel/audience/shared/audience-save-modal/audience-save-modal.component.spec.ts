import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { SharedModule } from './../../../../../shared/shared.module';
import { AudienceSaveModalComponent } from './audience-save-modal.component';
import { CPI18nService } from './../../../../../shared/services/i18n.service';

describe('AudienceSaveModalComponent', () => {
  let comp: AudienceSaveModalComponent;
  let fixture: ComponentFixture<AudienceSaveModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, ReactiveFormsModule, RouterTestingModule],
      declarations: [AudienceSaveModalComponent],
      providers: [CPI18nService, FormBuilder]
    });
    fixture = TestBed.createComponent(AudienceSaveModalComponent);
    comp = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(AudienceSaveModalComponent).toBeTruthy();
  });

  it('doSubmit', () => {
    spyOn(comp.onSubmit, 'emit');

    comp.doSubmit();

    expect(comp.onSubmit.emit).toHaveBeenCalledTimes(1);
    expect(comp.onSubmit.emit).toHaveBeenCalledWith({ name: null });
  });

  it('ngOnInit', () => {
    expect(comp.form.valid).toBeFalsy();
    expect(comp.buttonData.disabled).toBeTruthy();
  });

  it('valid form', () => {
    comp.form.controls['name'].setValue('hello');

    expect(comp.form.valid).toBeTruthy();
    expect(comp.buttonData.disabled).toBeFalsy();
  });

  it('reset', () => {
    spyOn(comp, 'resetModal');

    const closeButton = fixture.debugElement.query(By.css('.cpmodal__header__close')).nativeElement;

    const cancelButton = fixture.debugElement.query(By.css('.cpbtn--cancel')).nativeElement;

    closeButton.click();

    expect(comp.resetModal).toHaveBeenCalledTimes(1);

    cancelButton.click();

    expect(comp.resetModal).toHaveBeenCalledTimes(2);
  });

  it('resetModal', () => {
    spyOn(comp.teardown, 'emit');
    spyOn(comp.form, 'reset');

    comp.resetModal();

    expect(comp.form.reset).toHaveBeenCalledTimes(1);
    expect(comp.teardown.emit).toHaveBeenCalledTimes(1);
  });
});
