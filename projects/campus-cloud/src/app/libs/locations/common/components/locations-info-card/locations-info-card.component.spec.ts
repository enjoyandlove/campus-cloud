import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

import { CPSession } from '@campus-cloud/session';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { configureTestSuite } from '@campus-cloud/shared/tests';
import { mockLocations } from '@campus-cloud/libs/locations/common/tests';
import { getElementByCPTargetValue } from '@campus-cloud/shared/utils/tests';
import { LocationsInfoCardComponent } from './locations-info-card.component';

describe('LocationsInfoCardComponent', () => {
  configureTestSuite();

  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        imports: [SharedModule, HttpClientModule, RouterTestingModule],
        providers: [CPSession],
        declarations: [LocationsInfoCardComponent],
        schemas: [NO_ERRORS_SCHEMA]
      });

      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail)
  );

  let de: DebugElement;
  let fixture: ComponentFixture<LocationsInfoCardComponent>;
  let component: LocationsInfoCardComponent;

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationsInfoCardComponent);
    component = fixture.componentInstance;

    component.location = mockLocations[0];

    de = fixture.debugElement;

    fixture.detectChanges();
  });

  it('should have phone number', () => {
    const phone = getElementByCPTargetValue(de, 'phone').nativeElement;

    expect(phone.textContent).toEqual(component.location.phone.toString());
  });

  it('should have email', () => {
    const email = getElementByCPTargetValue(de, 'email').nativeElement;

    expect(email.textContent).toEqual(component.location.email);
  });

  it('should have address', () => {
    const address = getElementByCPTargetValue(de, 'address').nativeElement;

    expect(address.textContent).toEqual(component.location.address);
  });
});
