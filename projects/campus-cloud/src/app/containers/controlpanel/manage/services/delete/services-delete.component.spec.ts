import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { By } from '@angular/platform-browser';

import { configureTestSuite } from '@campus-cloud/shared/tests';
import { ServicesModule } from '../services.module';
import { ServicesService } from '../services.service';
import { CPDeleteModalComponent } from '@campus-cloud/shared/components';
import { MockServicesService, mockService } from '../tests';
import { CPI18nService, MODAL_DATA } from '@campus-cloud/shared/services';
import { ServicesDeleteComponent } from './services-delete.component';

describe('ServicesDeleteComponent', () => {
  configureTestSuite();

  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        imports: [ServicesModule, HttpClientModule, RouterTestingModule],
        providers: [
          CPI18nService,
          {
            provide: MODAL_DATA,
            useValue: {
              data: mockService,
              onClose: () => {}
            }
          },
          { provide: ServicesService, useClass: MockServicesService }
        ]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let component: ServicesDeleteComponent;
  let deleteModal: CPDeleteModalComponent;
  let fixture: ComponentFixture<ServicesDeleteComponent>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ServicesDeleteComponent);
    component = fixture.componentInstance;
    deleteModal = fixture.debugElement.query(By.directive(CPDeleteModalComponent))
      .componentInstance;

    fixture.detectChanges();
  }));

  it('should init', () => {
    expect(component).toBeTruthy();
  });

  it('should call onDelete on cp-delete-modal deleteClick', () => {
    spyOn(component, 'onDelete');
    deleteModal.deleteClick.emit();

    expect(component.onDelete).toHaveBeenCalled();
  });

  it('should call onClose on cp-delete-modal cancelClick', () => {
    spyOn(component, 'onClose');
    deleteModal.cancelClick.emit();

    expect(component.onClose).toHaveBeenCalled();
  });
});
