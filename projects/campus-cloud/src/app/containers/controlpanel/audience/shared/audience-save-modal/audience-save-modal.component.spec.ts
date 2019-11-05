import { MODAL_DATA } from './../../../../../shared/services/modal/modal.service';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { CPTestModule } from '@campus-cloud/shared/tests';
import { AudienceSaveModalComponent } from './audience-save-modal.component';

describe('AudienceSaveModalComponent', () => {
  let comp: AudienceSaveModalComponent;
  let fixture: ComponentFixture<AudienceSaveModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CPTestModule, ReactiveFormsModule, RouterTestingModule],
      declarations: [AudienceSaveModalComponent],
      providers: [
        FormBuilder,
        {
          provide: MODAL_DATA,
          useValue: {
            onAction: () => {},
            onClose: () => {}
          }
        }
      ]
    });
    fixture = TestBed.createComponent(AudienceSaveModalComponent);
    comp = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(AudienceSaveModalComponent).toBeTruthy();
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
});
