import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { mockTesters } from '../tests';
import { configureTestSuite } from '@campus-cloud/shared/tests';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { TestersCreateComponent } from './testers-create.component';
import { CPI18nService, ModalService, MODAL_DATA } from '@campus-cloud/shared/services';

describe('TestersCreateComponent', () => {
  configureTestSuite();
  beforeAll((done) => {
    (async () => {
      await TestBed.configureTestingModule({
        imports: [SharedModule, ReactiveFormsModule],
        providers: [
          CPI18nService,
          ModalService,
          {
            provide: MODAL_DATA,
            useValue: {
              data: 123,
              onClose: () => {},
              onAction: () => {}
            }
          }
        ],
        declarations: [TestersCreateComponent]
      }).compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let component: TestersCreateComponent;
  let fixture: ComponentFixture<TestersCreateComponent>;
  let actionSpy;
  let closeSpy;

  beforeEach(() => {
    fixture = TestBed.createComponent(TestersCreateComponent);
    component = fixture.componentInstance;

    actionSpy = spyOn(component.modal, 'onAction');
    closeSpy = spyOn(component.modal, 'onClose');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create', () => {
    const email = mockTesters[0].email;
    component.form.get('emails').setValue(email);
    component.doCreate();

    expect(actionSpy).toHaveBeenCalledTimes(1);
    expect(actionSpy).toHaveBeenCalledWith([email]);
    expect(closeSpy).toHaveBeenCalledTimes(1);
  });

  it('should close', () => {
    component.doCancel();
    expect(closeSpy).toHaveBeenCalledTimes(1);
  });

  it('should validate form', () => {
    expect(component.form.valid).toBe(false);
    component.form.get('emails').setValue('test');
    expect(component.form.valid).toBe(false);
    component.form.get('emails').setValue(mockTesters[0].email);
    expect(component.form.valid).toBe(true);
  });
});
