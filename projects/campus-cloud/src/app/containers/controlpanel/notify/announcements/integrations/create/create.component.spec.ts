import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule, Store } from '@ngrx/store';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

import * as fromStore from '../store';
import { filledForm } from '../tests/mock';
import { CPSession } from '@campus-cloud/session';
import { RootStoreModule } from '@campus-cloud/store';
import mockSession from '@campus-cloud/session/mock/session';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { AnnouncementsIntegrationFormComponent } from '../components';
import { AnnouncementsIntegrationCreateComponent } from './create.component';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';
import { ModalService, MODAL_DATA, CPI18nService } from '@campus-cloud/shared/services';

describe('AnnouncementsIntegrationCreateComponent', () => {
  configureTestSuite();
  beforeAll((done) => {
    (async () => {
      await TestBed.configureTestingModule({
        imports: [
          CPTestModule,
          SharedModule,
          RootStoreModule,
          HttpClientModule,
          ReactiveFormsModule,
          RouterTestingModule,
          StoreModule.forFeature('announcementIntegrations', fromStore.reducers)
        ],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          ModalService,
          CPI18nService,
          {
            provide: CPSession,
            useValue: mockSession
          },
          {
            provide: MODAL_DATA,
            useValue: {
              data: 123,
              onClose: () => {}
            }
          }
        ],
        declarations: [
          AnnouncementsIntegrationFormComponent,
          AnnouncementsIntegrationCreateComponent
        ]
      }).compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let component: AnnouncementsIntegrationCreateComponent;
  let fixture: ComponentFixture<AnnouncementsIntegrationCreateComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnouncementsIntegrationCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should submit and dispatch create action', () => {
    const spy = spyOn(component, 'doSubmit').and.callThrough();
    const store = TestBed.get(Store);
    const dispatchSpy = spyOn(store, 'dispatch');

    component.form.setValue(filledForm);
    fixture.detectChanges();
    const submitBtn = fixture.debugElement.query(By.css('[data-target="submit"]'));
    submitBtn.nativeElement.click();

    const payload = component.form.value;
    expect(spy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith(new fromStore.CreateIntegration(payload));
  });

  it('should close', () => {
    const spy = spyOn(component.modal, 'onClose');
    const closeBtn = fixture.debugElement.query(By.css('[data-target="close"]'));
    closeBtn.nativeElement.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should cancel', () => {
    const spy = spyOn(component.modal, 'onClose');
    const cancelBtn = fixture.debugElement.query(By.css('[data-target="cancel"]'));
    cancelBtn.nativeElement.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
