import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { of } from 'rxjs';

import { CPSession } from '@app/session';
import { SharedModule } from '@shared/shared.module';
import { mockSchool } from '@app/session/mock/school';
import { configureTestSuite } from '@app/shared/tests';
import { HttpClientModule } from '@angular/common/http';
import { CPTrackingService, CPI18nService } from '@shared/services';
import { LocationsListComponent } from './locations-list.component';
import { ManageHeaderService } from '@containers/controlpanel/manage/utils';

describe('LocationsListComponent', () => {
  configureTestSuite();

  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        imports: [SharedModule, HttpClientModule, RouterTestingModule, StoreModule.forRoot({})],
        providers: [CPSession, CPI18nService, CPTrackingService, ManageHeaderService],
        declarations: [LocationsListComponent],
        schemas: [NO_ERRORS_SCHEMA]
      });

      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail)
  );

  let fixture: ComponentFixture<LocationsListComponent>;
  let component: LocationsListComponent;

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationsListComponent);
    component = fixture.componentInstance;
    component.session.g.set('school', mockSchool);
  });

  it('should init', () => {
    expect(component).toBeTruthy();
  });

  it('should search string', () => {
    component.onSearch('hello world');
    expect(component.state.search_str).toEqual('hello world');
  });

  it('should sort by name', () => {
    component.doSort('name');
    expect(component.state.sort_field).toEqual('name');
  });

  it('should set error message', () => {
    spyOn(component.store, 'select').and.returnValue(of(true));

    component.setErrors();

    expect(component.contentText).toBe('something_went_wrong');
  });
});
