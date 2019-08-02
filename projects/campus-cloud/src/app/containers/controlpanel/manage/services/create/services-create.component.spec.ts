import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { of as observableOf } from 'rxjs';

import { ServicesModule } from '../services.module';
import { ServicesService } from '../services.service';
import { baseReducers } from '@campus-cloud/store/base';
import { CPTestModule } from '@campus-cloud/shared/tests';
import { mockSchool } from '@campus-cloud/session/mock/school';
import { ServicesUtilsService } from '../services.utils.service';
import { ServicesCreateComponent } from './services-create.component';

class MockService {
  dummy;

  getCategories() {
    return observableOf({});
  }

  createService(body: any) {
    this.dummy = [body];

    return observableOf({});
  }
}

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

describe('ServicesCreateComponent', () => {
  let spy;
  let component: ServicesCreateComponent;
  let fixture: ComponentFixture<ServicesCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CPTestModule,
        ServicesModule,
        HttpClientModule,
        RouterTestingModule,
        StoreModule.forRoot({
          HEADER: baseReducers.HEADER,
          SNACKBAR: baseReducers.SNACKBAR
        })
      ],
      providers: [ServicesUtilsService, { provide: ServicesService, useClass: MockService }]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ServicesCreateComponent);

        component = fixture.componentInstance;

        spyOn(component.router, 'navigate');
        spyOn(component.servicesService, 'getCategories');

        component.session.g.set('school', mockSchool);
        spy = spyOn(component.servicesService, 'createService').and.returnValue(observableOf({}));
        component.ngOnInit();
      });
  }));

  it('onResetMap', () => {
    component.onResetMap();

    expect(component.drawMarker.value).toBe(false);
    expect(component.form.controls['room_data'].value).toBeNull();
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
    expect(component.form.controls['room_data'].value).toBeNull();
    expect(component.mapCenter.value.lat).toEqual(mockSchool.latitude);
    expect(component.mapCenter.value.lng).toEqual(mockSchool.latitude);
  });

  it('form validation should fail required fields missing', () => {
    component.onSubmit();

    expect(component.formError).toBe(true);
    expect(component.form.valid).toBe(false);
    expect(component.buttonData.disabled).toBe(false);
  });

  it('should create service', () => {
    component.form.controls['category'].setValue(5);
    component.form.controls['name'].setValue('Hello World');
    component.form.controls['logo_url'].setValue('log.jpg');

    component.onSubmit();

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(component.formError).toBe(false);
    expect(component.form.valid).toBe(true);
    expect(component.buttonData.disabled).toBe(false);
  });
});
