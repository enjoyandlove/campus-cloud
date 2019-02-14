import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

import { CPSession } from '@app/session';
import { SharedModule } from '@shared/shared.module';
import { configureTestSuite } from '@app/shared/tests';
import { getElementByCPTargetValue } from '@shared/utils/tests';
import { mockLinks, mockLocations } from '@libs/locations/common/tests';
import { LocationsMetaDataComponent } from './locations-meta-data.component';

describe('LocationsMetaDataComponent', () => {
  configureTestSuite();

  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        imports: [SharedModule, HttpClientModule, RouterTestingModule],
        providers: [CPSession],
        declarations: [LocationsMetaDataComponent],
        schemas: [NO_ERRORS_SCHEMA]
      });

      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail)
  );

  let de: DebugElement;
  let fixture: ComponentFixture<LocationsMetaDataComponent>;
  let component: LocationsMetaDataComponent;

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationsMetaDataComponent);
    component = fixture.componentInstance;

    const locations = {
      ...mockLocations[0],
      links: mockLinks
    };

    component.location = locations;

    de = fixture.debugElement;

    fixture.detectChanges();
  });

  it('should have acronym', () => {
    const acronym = getElementByCPTargetValue(de, 'acronym').nativeElement;

    expect(acronym.textContent).toEqual(component.location.short_name);
  });

  it('should have description', () => {
    const description = getElementByCPTargetValue(de, 'description').nativeElement;

    expect(description.textContent.trim()).toEqual(component.location.description);
  });

  it('should have link label', () => {
    const label = getElementByCPTargetValue(de, 'label').nativeElement;

    expect(label.textContent.trim()).toEqual(component.location.links[0].label);
  });

  it('should have link url', () => {
    const url = getElementByCPTargetValue(de, 'url').nativeElement;

    expect(url.textContent.trim()).toEqual(component.location.links[0].url);
  });
});
