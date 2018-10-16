import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { of as observableOf } from 'rxjs';

import { ServicesModule } from '../services.module';
import { ServicesService } from '../services.service';
import { CPI18nService } from '../../../../../shared/services';
import { ServicesDeleteComponent } from './services-delete.component';

class MockService {
  dummy;

  deleteService(serviceId: any) {
    this.dummy = [serviceId];

    return observableOf({});
  }
}

describe('ServicesDeleteComponent', () => {
  let spy;
  let component: ServicesDeleteComponent;
  let fixture: ComponentFixture<ServicesDeleteComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          ServicesModule,
          HttpClientModule,
          RouterTestingModule
        ],
        providers: [
          CPI18nService,
          { provide: ServicesService, useClass: MockService }
        ]
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(ServicesDeleteComponent);

          component = fixture.componentInstance;
          component.service = {
            ...component.service,
            id: 123
          };

          spyOn(component.deleted, 'emit');
          spy = spyOn(component.servicesService, 'deleteService')
            .and.returnValue(observableOf({}));

          component.ngOnInit();
        });
    })
  );

  it('Should delete service', () => {
    component.onDelete();

    expect(component.buttonData.disabled).toBe(false);

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(component.service.id);

    expect(component.deleted.emit).toHaveBeenCalled();
    expect(component.deleted.emit).toHaveBeenCalledTimes(1);
    expect(component.deleted.emit).toHaveBeenCalledWith(component.service.id);
  });
});
