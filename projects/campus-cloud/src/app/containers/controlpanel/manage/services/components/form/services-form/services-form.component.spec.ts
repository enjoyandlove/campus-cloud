import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';

import { CPSession } from '@campus-cloud/session';
import { mockSchool } from '@campus-cloud/session/mock/school';
import { ServicesFormComponent } from './services-form.component';
import { mockLocation } from '@controlpanel/manage/services/tests';
import { ServicesService } from '@controlpanel/manage/services/services.service';
import { ServicesModel } from '@controlpanel/manage/services/model/services.model';
import { configureTestSuite, CPTestModule, MOCK_IMAGE } from '@campus-cloud/shared/tests';
import { ServicesUtilsService } from '@controlpanel/manage/services/services.utils.service';

describe('ServicesFormComponent', () => {
  configureTestSuite();

  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        declarations: [ServicesFormComponent],
        providers: [ServicesService, provideMockStore(), ServicesUtilsService],
        imports: [CPTestModule],
        schemas: [NO_ERRORS_SCHEMA]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let session;
  let de: DebugElement;
  let component: ServicesFormComponent;
  let fixture: ComponentFixture<ServicesFormComponent>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ServicesFormComponent);
    component = fixture.componentInstance;

    component.school = mockSchool;
    session = TestBed.get(CPSession);
    session.g.set('school', mockSchool);
    component.form = ServicesModel.form();
    spyOn(component.servicesService, 'getCategories').and.returnValue(of([]));

    de = fixture.debugElement;

    fixture.detectChanges();
  }));

  it('should upload image', () => {
    component.onUploadedImage(MOCK_IMAGE);

    expect(component.form.get('logo_url').value).toEqual(MOCK_IMAGE);
  });

  it('should toggle membership value', () => {
    let membership = {
      action: true
    };
    component.onSelectedMembership(membership);

    expect(component.form.get('has_membership').value).toBe(true);

    membership = {
      action: false
    };

    component.onSelectedMembership(membership);
    expect(component.form.get('has_membership').value).toBe(false);
  });

  it('should update category', () => {
    spyOn(component.amplitudeProperties, 'emit');
    const category = {
      action: 1,
      label: 'label'
    };
    component.onCategoryUpdate(category);

    expect(component.amplitudeProperties.emit).toHaveBeenCalled();
    expect(component.form.get('category').value).toBe(category.action);
  });

  it('onResetMap', () => {
    component.onResetMap();

    expect(component.drawMarker.value).toBe(false);
    expect(component.form.get('room_data').value).toEqual('');
    expect(component.mapCenter.value.lat).toEqual(mockSchool.latitude);
    expect(component.mapCenter.value.lng).toEqual(mockSchool.latitude);
  });

  it('onPlaceChange', () => {
    component.onPlaceChange(mockLocation);

    expect(component.form.get('city').value).toEqual(mockLocation.city);
    expect(component.form.get('location').value).toEqual(mockLocation.name);
    expect(component.form.get('country').value).toEqual(mockLocation.country);
    expect(component.form.get('address').value).toEqual(mockLocation.address);
    expect(component.form.get('latitude').value).toEqual(mockLocation.latitude);
    expect(component.form.get('longitude').value).toEqual(mockLocation.longitude);
    expect(component.form.get('postal_code').value).toEqual(mockLocation.postal_code);
  });

  it('should show/hide location details & set address required/optional onLocationToggle ', () => {
    component.onLocationToggle(true);

    expect(component.showLocationDetails).toBe(true);
    expect(component.form.get('address').invalid).toBe(true);

    // reset location
    component.onLocationToggle(false);

    expect(component.drawMarker.value).toBe(false);
    expect(component.showLocationDetails).toBe(false);
    expect(component.form.get('address').invalid).toBe(false);
    expect(component.form.controls['room_data'].value).toBe('');
    expect(component.mapCenter.value.lat).toEqual(mockSchool.latitude);
    expect(component.mapCenter.value.lng).toEqual(mockSchool.latitude);
  });
});
