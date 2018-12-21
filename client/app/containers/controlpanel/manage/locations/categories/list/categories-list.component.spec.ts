import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { of } from 'rxjs';

import * as fromRoot from '@app/store';
import { CPSession } from '@app/session';
import { CPI18nService } from '@shared/services';
import { SharedModule } from '@shared/shared.module';
import { mockSchool } from '@app/session/mock/school';
import { configureTestSuite } from '@app/shared/tests';
import { CategoriesListComponent } from './categories-list.component';

fdescribe('CategoriesListComponent', () => {
  configureTestSuite();

  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        imports: [SharedModule, HttpClientModule, RouterTestingModule, StoreModule.forRoot({})],
        providers: [CPSession, CPI18nService],
        declarations: [CategoriesListComponent],
        schemas: [NO_ERRORS_SCHEMA]
      });

      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail)
  );

  let fixture: ComponentFixture<CategoriesListComponent>;
  let component: CategoriesListComponent;
  let fetchSpy: jasmine.Spy;
  let dispatchSpy: jasmine.Spy;

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriesListComponent);
    component = fixture.componentInstance;
    component.session.g.set('school', mockSchool);
    fetchSpy = spyOn(component, 'fetch');
    dispatchSpy = spyOn(component.store, 'dispatch');
  });

  it('should init', () => {
    expect(component).toBeTruthy();
  });

  it('should be default category', () => {
    const isDefault = component.isDefault(true);

    expect(isDefault).toEqual('Yes');
  });

  it('should not be default category', () => {
    const isDefault = component.isDefault(false);

    expect(isDefault).toEqual('No');
  });

  it('should search string', () => {
    component.onSearch('hello world');

    expect(fetchSpy).toHaveBeenCalled();
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(component.state.search_str).toEqual('hello world');
  });

  it('should sort by name', () => {
    component.doSort('name');

    expect(fetchSpy).toHaveBeenCalled();
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(component.state.sort_field).toEqual('name');
  });

  it('should set error message', () => {
    spyOn(component.store, 'select').and.returnValue(of(true));

    component.listenForErrors();
    const { payload, type } = dispatchSpy.calls.mostRecent().args[0];

    expect(payload.class).toBe('danger');
    expect(type).toBe(fromRoot.baseActions.SNACKBAR_SHOW);
  });
});
