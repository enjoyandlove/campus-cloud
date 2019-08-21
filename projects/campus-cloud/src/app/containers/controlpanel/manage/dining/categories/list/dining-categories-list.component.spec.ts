import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { provideMockStore } from '@ngrx/store/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { mockSchool } from '@campus-cloud/session/mock/school';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';
import { DiningCategoriesListComponent } from './dining-categories-list.component';
import { mockCategories } from '@campus-cloud/libs/locations/common/categories/tests';
import { CategoryTypePipe } from '@campus-cloud/libs/locations/common/categories/pipes';
import { CategoriesActionBoxComponent } from '@campus-cloud/libs/locations/common/categories/components';

describe('DiningCategoriesListComponent', () => {
  configureTestSuite();

  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        imports: [CPTestModule, HttpClientModule, RouterTestingModule],
        providers: [provideMockStore()],
        declarations: [
          DiningCategoriesListComponent,
          CategoryTypePipe,
          CategoriesActionBoxComponent
        ],
        schemas: [NO_ERRORS_SCHEMA]
      });

      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail)
  );

  let fetchSpy: jasmine.Spy;
  let component: DiningCategoriesListComponent;
  let actionBox: CategoriesActionBoxComponent;
  let fixture: ComponentFixture<DiningCategoriesListComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DiningCategoriesListComponent);
    component = fixture.componentInstance;
    component.session.g.set('school', mockSchool);
    fetchSpy = spyOn(component, 'fetchFilteredCategories');

    actionBox = fixture.debugElement.query(By.directive(CategoriesActionBoxComponent))
      .componentInstance;

    fixture.detectChanges();
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
    component.state = {
      ...component.state,
      search_str: null,
      sort_field: 'name',
      sort_direction: 'asc'
    };

    fixture.detectChanges();

    component.doSort('name');

    expect(fetchSpy).toHaveBeenCalled();
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(component.state.sort_field).toEqual('name');
  });
});
