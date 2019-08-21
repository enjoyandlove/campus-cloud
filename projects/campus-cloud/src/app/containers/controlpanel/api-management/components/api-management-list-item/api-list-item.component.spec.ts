import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { of } from 'rxjs';

import { reducers } from '../../store';
import { RootStoreModule } from '@campus-cloud/store';
import { mockSchool } from '@campus-cloud/session/mock';
import { mockAPIData } from '@controlpanel/api-management/tests';
import { ApiListItemComponent } from './api-list-item.component';
import { getElementByCPTargetValue } from '@campus-cloud/shared/utils/tests';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';
import { ApiManagementFormComponent } from '@controlpanel/api-management/components';
import { ApiManagementUtilsService } from '@controlpanel/api-management/api-management.utils.service';

describe('ApiListItemComponent', () => {
  configureTestSuite();

  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        declarations: [ApiListItemComponent, ApiManagementFormComponent],
        providers: [ApiManagementUtilsService],
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
  let formComponent: ComponentFixture<ApiManagementFormComponent>;
  let fixture: ComponentFixture<ApiListItemComponent>;
  let component: ApiListItemComponent;
  let formComp: ApiManagementFormComponent;

  beforeEach(async(() => {
    formComponent = TestBed.createComponent(ApiManagementFormComponent);
    fixture = TestBed.createComponent(ApiListItemComponent);
    component = fixture.componentInstance;
    formComp = formComponent.componentInstance;
    formComp.session.g.set('school', mockSchool);

    spyOn(component.store, 'select');
    spyOn(component.store, 'dispatch');
    de = fixture.debugElement;
    fixture.detectChanges();
  }));

  it('should init', () => {
    expect(component).toBeTruthy();
  });

  describe('API List Item', () => {
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

  describe('API Edit', () => {
    it('should not show edit form', () => {
      withMockApi(component);
      fixture.detectChanges();

      const editForm = de.query(By.directive(ApiManagementFormComponent));

      expect(editForm).toBeNull();
      expect(component.isEdit).toBe(false);
    });

    it('should show edit form on edit button click', () => {
      const index = 0;
      withMockApi(component);
      fixture.detectChanges();

      const editButton = getElementByCPTargetValue(de, 'edit_0').nativeElement;

      editButton.click();

      withMockApi(component);
      fixture.detectChanges();

      const editForm = de.query(By.directive(ApiManagementFormComponent));

      expect(editForm).not.toBeNull();
      expect(component.isEdit).toBe(true);
      expect(component.widgetIndex).toEqual(index);
    });

    it('should hide edit form on cancel click', () => {
      withMockApi(component);
      fixture.detectChanges();

      const editButton = getElementByCPTargetValue(de, 'edit_0').nativeElement;

      editButton.click();

      withMockApi(component);
      fixture.detectChanges();

      expect(component.isEdit).toBe(true);

      const editForm = de.query(By.directive(ApiManagementFormComponent)).componentInstance;

      editForm.cancelEdit.emit();

      expect(component.isEdit).toBe(false);
    });

    it('should submit edit form on save click', () => {
      const body = mockAPIData[0];
      const id = mockAPIData[0].id;
      const spy = spyOn(component, 'onFormSubmitted');
      withMockApi(component);
      fixture.detectChanges();

      const editButton = getElementByCPTargetValue(de, 'edit_0').nativeElement;

      editButton.click();

      withMockApi(component);
      fixture.detectChanges();

      expect(component.isEdit).toBe(true);

      const editForm = de.query(By.directive(ApiManagementFormComponent)).componentInstance;

      editForm.submitted.emit(body);

      expect(spy).toHaveBeenCalled();
      expect(component.isEdit).toBe(true);
      expect(spy).toHaveBeenCalledWith(id, body);
    });
  });

  it('should trigger revoke modal on revoke button click', () => {
    const spy = spyOn(component, 'revokeAccessToken');
    withMockApi(component);

    fixture.detectChanges();

    const deleteButton = getElementByCPTargetValue(de, 'delete_0').nativeElement;

    deleteButton.click();

    component.loading$ = of(false);
    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(mockAPIData[0]);
  });
});

function noApi(component: ApiListItemComponent) {
  component.items$ = of([]);
  component.loading$ = of(false);
}

function withMockApi(component: ApiListItemComponent) {
  component.items$ = of(mockAPIData);
  component.item$ = of(mockAPIData[0]);
  component.loading$ = of(false);
}
