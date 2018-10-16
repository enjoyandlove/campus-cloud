import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { of as observableOf } from 'rxjs';

import { reducers } from '../../../../../reducers';
import { CPSession } from '../../../../../session';
import { ServicesModule } from '../services.module';
import { ServicesService } from '../services.service';
import { CPI18nService } from '../../../../../shared/services';
import { mockSchool } from '../../../../../session/mock/school';
import { ServicesUtilsService } from '../services.utils.service';
import { ServicesEditComponent } from './services-edit.component';
import { RatingScale, ServiceAttendance } from '../services.status';

class MockService {
  dummy;

  getServiceById(serviceId: number) {
    this.dummy = [serviceId];

    return observableOf({});
  }

  getCategories() {
    return observableOf({});
  }

  updateService(body: any, serviceId: number) {
    this.dummy = [body, serviceId];

    return observableOf({});
  }
}

const mockService = require('../mock.json');

const mockCategories = [
  {
    id: 23,
    name: 'Hello World 1'
  },
  {
    id: 24,
    name: 'Hello World 2'
  }
];

const mockLocation = {
  city: 'Montreal',
  province: '',
  country: 'Canada',
  name: 'Milton Pizza',
  postal_code: 'H3A 2A8',
  fromUsersLocations: true,
  latitude: 45.5068431590247,
  longitude: -73.5762119293213,
  address: '635-659 Milton St, Montreal, QC H3A 2A8, Canada'
};

describe('ServicesUpdateComponent', () => {
  let spy;
  let component: ServicesEditComponent;
  let fixture: ComponentFixture<ServicesEditComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          ServicesModule,
          HttpClientModule,
          RouterTestingModule,
          StoreModule.forRoot({
            HEADER: reducers.HEADER,
            SNACKBAR: reducers.SNACKBAR
          })
        ],
        providers: [
          CPSession,
          CPI18nService,
          ServicesUtilsService,
          { provide: ServicesService, useClass: MockService }
        ]
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(ServicesEditComponent);

          component = fixture.componentInstance;
          component.session.g.set('school', mockSchool);
          component.serviceId = 123;

          spyOn(component.router, 'navigate');
          spyOn(component.servicesService, 'getCategories').and.returnValue(
            observableOf(mockCategories)
          );

          spyOn(component.servicesService, 'getServiceById').and.returnValue(
            observableOf(mockService[0])
          );

          spy = spyOn(component.servicesService, 'updateService').and.returnValue(observableOf({}));

          component.ngOnInit();
        });
    })
  );

  it('onResetMap', () => {
    component.onResetMap();

    expect(component.drawMarker.value).toBe(false);
    expect(component.form.controls['room_data'].value).toBe('');
    expect(component.mapCenter.value.lat).toEqual(mockSchool.latitude);
    expect(component.mapCenter.value.lng).toEqual(mockSchool.latitude);
  });

  it('onPlaceChange', () => {
    component.onPlaceChange(mockLocation);

    expect(component.form.controls['city'].value).toEqual(mockLocation.city);
    expect(component.form.controls['location'].value).toEqual(mockLocation.name);
    expect(component.form.controls['country'].value).toEqual(mockLocation.country);
    expect(component.form.controls['address'].value).toEqual(mockLocation.address);
    expect(component.form.controls['latitude'].value).toEqual(mockLocation.latitude);
    expect(component.form.controls['longitude'].value).toEqual(mockLocation.longitude);
    expect(component.form.controls['postal_code'].value).toEqual(mockLocation.postal_code);
  });

  it('onLocationToggle', () => {
    component.onLocationToggle(true);

    expect(component.showLocationDetails).toBe(true);

    // reset location
    component.onLocationToggle(false);

    expect(component.drawMarker.value).toBe(false);
    expect(component.showLocationDetails).toBe(false);
    expect(component.form.controls['room_data'].value).toBe('');
    expect(component.mapCenter.value.lat).toEqual(mockSchool.latitude);
    expect(component.mapCenter.value.lng).toEqual(mockSchool.latitude);
  });

  it('form validation should fail required fields missing', () => {
    component.form.controls['name'].setValue(null);
    component.form.controls['category'].setValue(null);
    component.form.controls['logo_url'].setValue(null);

    component.onSubmit();

    expect(component.formError).toBe(true);
    expect(component.form.valid).toBe(false);
    expect(component.buttonData.disabled).toBe(true);
  });

  it('onToggleAttendance', () => {
    const feedbackLabel = component.cpI18n.translate('services_default_feedback_question');
    component.onToggleAttendance(true);

    expect(component.form.controls['rating_scale_maximum'].value).toBe(RatingScale.maxScale);
    expect(component.form.controls['default_basic_feedback_label'].value).toBe(feedbackLabel);
    expect(component.form.controls['service_attendance'].value).toBe(ServiceAttendance.enabled);

    component.onToggleAttendance(false);

    expect(component.form.controls['default_basic_feedback_label'].value).toBeNull();
    expect(component.form.controls['rating_scale_maximum'].value).toBe(RatingScale.noScale);
    expect(component.form.controls['service_attendance'].value).toBe(ServiceAttendance.disabled);
  });

  it('should update service', () => {
    component.onSubmit();

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(component.formError).toBe(false);
    expect(component.form.valid).toBe(true);
  });
});
