import { RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { of } from 'rxjs';

import { reducers } from '../store';
import { RootStoreModule } from '@campus-cloud/store';
import { RouterParamsUtils } from '@campus-cloud/shared/utils';
import { mockAPIData } from '@controlpanel/api-management/tests';
import { CustomSerializer } from '@campus-cloud/store/serializers';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';
import { ApiManagementFormComponent } from '@controlpanel/api-management/components';
import { ApiListComponent } from '@controlpanel/api-management/list/api-list.component';
import { CPPaginationComponent, CPSpinnerComponent } from '@campus-cloud/shared/components';
import { ApiManagementUtilsService } from '@controlpanel/api-management/api-management.utils.service';

describe('ApiListComponent', () => {
  configureTestSuite();

  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        declarations: [ApiListComponent, ApiManagementFormComponent],
        providers: [
          RouterParamsUtils,
          ApiManagementUtilsService,
          { provide: RouterStateSerializer, useClass: CustomSerializer }
        ],
        imports: [
          CPTestModule,
          RootStoreModule,
          StoreRouterConnectingModule.forRoot(),
          StoreModule.forFeature('apiManagement', reducers)
        ],
        schemas: [NO_ERRORS_SCHEMA]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let de: DebugElement;
  let fixture: ComponentFixture<ApiListComponent>;
  let component: ApiListComponent;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ApiListComponent);
    component = fixture.componentInstance;

    de = fixture.debugElement;
    fixture.detectChanges();
  }));

  describe('cp-spinner', () => {
    it('should show on loading$ true', () => {
      component.loading$ = of(true);

      fixture.detectChanges();

      const spinnerComp = de.query(By.directive(CPSpinnerComponent));
      expect(spinnerComp).not.toBeNull();
    });

    it('should show on loading$ false', () => {
      component.loading$ = of(false);

      fixture.detectChanges();

      const spinnerComp = de.query(By.directive(CPSpinnerComponent));
      expect(spinnerComp).toBeNull();
    });
  });

  describe('cp-pagination', () => {
    it('should set initial pagination', () => {
      const expected = { next: false, previous: false, page: 1 };
      component.pagination$.subscribe((state) => {
        expect(state).toEqual(expected);
      });
    });

    it('should not show when no APIs are found', () => {
      noApi(component);
      fixture.detectChanges();

      const paginationComp = de.query(By.directive(CPPaginationComponent));
      expect(paginationComp).toBeNull();
    });

    it('should show when found APIs', () => {
      withMockApi(component);
      fixture.detectChanges();

      const paginationComp = de.query(By.directive(CPPaginationComponent));
      expect(paginationComp).not.toBeNull();
    });
  });

  describe('API List', () => {
    it('should not have API access tokens when items are empty', () => {
      noApi(component);
      fixture.detectChanges();

      component.items$.subscribe((items) => {
        expect(items.length).toEqual(0);
      });
    });

    it('should have API access tokens when items have data', () => {
      withMockApi(component);
      fixture.detectChanges();

      component.items$.subscribe((items) => {
        expect(items.length).toEqual(3);
      });
    });
  });
});

function noApi(component: ApiListComponent) {
  component.items$ = of([]);
  component.loading$ = of(false);
}

function withMockApi(component: ApiListComponent) {
  component.items$ = of(mockAPIData);
  component.loading$ = of(false);
}
