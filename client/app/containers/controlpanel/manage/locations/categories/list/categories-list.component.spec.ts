import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { of } from 'rxjs';

import * as fromRoot from '@app/store';
import { CPSession } from '@app/session';
import { CPI18nService } from '@shared/services';
import { configureTestSuite } from '@shared/tests';
import { SharedModule } from '@shared/shared.module';
import { mockSchool } from '@app/session/mock/school';
import { CategoriesListComponent } from './categories-list.component';
import { mockCategories} from '@libs/locations/common/categories/tests';
import { CategoryTypePipe } from '@libs/locations/common/categories/pipes';
import { CategoriesActionBoxComponent } from '@libs/locations/common/categories/components';

describe('CategoriesListComponent', () => {
  configureTestSuite();

  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        imports: [SharedModule, HttpClientModule, RouterTestingModule, StoreModule.forRoot({})],
        providers: [CPSession, CPI18nService, Actions],
        declarations: [CategoriesListComponent, CategoryTypePipe, CategoriesActionBoxComponent],
        schemas: [NO_ERRORS_SCHEMA]
      });

      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail)
  );

  let fetchSpy: jasmine.Spy;
  let dispatchSpy: jasmine.Spy;
  let component: CategoriesListComponent;
  let actionBox: CategoriesActionBoxComponent;
  let fixture: ComponentFixture<CategoriesListComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriesListComponent);
    component = fixture.componentInstance;
    component.session.g.set('school', mockSchool);
    dispatchSpy = spyOn(component.store, 'dispatch');
    fetchSpy = spyOn(component, 'fetchFilteredCategories');

    actionBox = fixture.debugElement.query(By.directive(CategoriesActionBoxComponent))
      .componentInstance;

    fixture.detectChanges();
  });

  it('should init', () => {
    expect(component).toBeTruthy();
  });

  it('should search string', () => {
    const query = 'hello world';
    spyOn(component, 'onSearch');

    actionBox.search.emit(query);

    expect(component.onSearch).toHaveBeenCalled();
    expect(component.onSearch).toHaveBeenCalledWith(query);
    expect(component.onSearch).toHaveBeenCalledTimes(1);
  });

  it('should click sort by name', () => {
    spyOn(component.store, 'select');
    component.loading$ = of(false);
    component.categories$ = of(mockCategories);

    fixture.detectChanges();

    component.doSort('name');

    expect(fetchSpy).toHaveBeenCalled();
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(component.state.sort_field).toEqual('name');
  });

  it('should set error message', () => {
    const errorKey = 'something_went_wrong';
    const errorMessage = 'Something went wrong';

    spyOn(component.store, 'select').and.returnValue(of(true));

    component.handleError(errorKey);
    const { payload, type } = dispatchSpy.calls.mostRecent().args[0];

    expect(payload.body).toEqual(errorMessage);
    expect(payload.class).toBe('danger');
    expect(type).toBe(fromRoot.baseActions.SNACKBAR_SHOW);
  });
});
