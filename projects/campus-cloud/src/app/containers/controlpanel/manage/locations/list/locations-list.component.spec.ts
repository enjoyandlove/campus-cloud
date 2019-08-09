import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { provideMockStore } from '@ngrx/store/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import * as fromRoot from '@campus-cloud/store';
import { mockSchool } from '@campus-cloud/session/mock/school';
import { LocationsListComponent } from './locations-list.component';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';
import { ManageHeaderService } from '@campus-cloud/containers/controlpanel/manage/utils';

describe('LocationsListComponent', () => {
  configureTestSuite();

  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        imports: [CPTestModule, HttpClientModule, RouterTestingModule],
        providers: [ManageHeaderService, provideMockStore()],
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
  let fetchSpy: jasmine.Spy;
  let dispatchSpy: jasmine.Spy;

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationsListComponent);
    component = fixture.componentInstance;
    component.session.g.set('school', mockSchool);
    dispatchSpy = spyOn(component.store, 'dispatch');
    fetchSpy = spyOn(component, 'fetchFilteredLocations');
  });

  it('should init', () => {
    expect(component).toBeTruthy();
  });

  it('should search string', () => {
    component.onSearch('hello world');

    expect(fetchSpy).toHaveBeenCalled();
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(component.state.search_str).toEqual('hello world');
  });

  it('should sort by name', () => {
    component.onDoSort('name');

    expect(fetchSpy).toHaveBeenCalled();
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(component.state.sort_field).toEqual('name');
  });

  it('should set error message', () => {
    spyOn(component.store, 'select').and.returnValue(of(true));

    component.listenForErrors();
    const { payload, type } = dispatchSpy.calls.mostRecent().args[0] as any;

    expect(payload.class).toBe('danger');
    expect(type).toBe(fromRoot.baseActions.SNACKBAR_SHOW);
  });
});
