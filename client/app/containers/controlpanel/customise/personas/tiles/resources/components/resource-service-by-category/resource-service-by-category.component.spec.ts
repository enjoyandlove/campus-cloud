/*tslint:disable:max-line-length */
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpParams } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { TilesService } from './../../../tiles.service';
import { CPSession } from '../../../../../../../../session';
import { mockSchool } from './../../../../../../../../session/mock/school';
import { SharedModule } from '../../../../../../../../shared/shared.module';
import { configureTestSuite } from './../../../../../../../../shared/tests';
import { CPI18nService } from './../../../../../../../../shared/services/i18n.service';
import { PersonasResourceServiceByCategoryComponent } from './resource-service-by-category.component';

import { CPDropdownComponent } from './../../../../../../../../shared/components/cp-dropdown/cp-dropdown.component';
import { CPDropdownMultiSelectComponent } from './../../../../../../../../shared/components/cp-dropdown-multiselect/cp-dropdown-multiselect.component';

class MockTileService {
  getServiceCategories() {
    return of([]);
  }
}

const mockCategory = { action: 1, label: 'mock' };

describe('PersonasResourceServiceByCategoryComponent', () => {
  configureTestSuite();

  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        imports: [SharedModule],
        providers: [CPI18nService, CPSession, { provide: TilesService, useClass: MockTileService }],
        declarations: [PersonasResourceServiceByCategoryComponent]
      });

      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail)
  );

  let serviceSpy;
  let component: PersonasResourceServiceByCategoryComponent;
  let fixture: ComponentFixture<PersonasResourceServiceByCategoryComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonasResourceServiceByCategoryComponent);
    component = fixture.componentInstance;

    component.session.g.set('school', mockSchool);
    component.params = {};
    serviceSpy = spyOn(component.tileService, 'getServiceCategories').and.returnValue(
      of([mockCategory])
    );
  });

  it('should init', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadCategories on init', () => {
    const spy = spyOn(component, 'loadCategories');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should load exclude / include dropdown', () => {
    fixture.detectChanges();
    expect(component.options.length).toBe(2);
  });

  it('should call onSelected on cp-dropdown selected callback', () => {
    spyOn(component, 'onSelected');

    const de = fixture.debugElement;
    const dropdown = de.query(By.directive(CPDropdownComponent));
    const dropDownComponent: CPDropdownComponent = dropdown.componentInstance;
    dropDownComponent.selected.emit({ label: 'hello', event: 'world!' });

    expect(component.onSelected).toHaveBeenCalled();
  });

  it('should call onMultiSelect on p-dropdown-multiselect selection callback', () => {
    spyOn(component, 'onMultiSelect');

    const de = fixture.debugElement;
    const dropdown = de.query(By.directive(CPDropdownMultiSelectComponent));
    const dropDownComponent: CPDropdownMultiSelectComponent = dropdown.componentInstance;
    dropDownComponent.selection.emit([1, 2, 3]);

    expect(component.onMultiSelect).toHaveBeenCalled();
  });

  it('should set isEditView to false', () => {
    fixture.detectChanges();
    expect(component.isEditView).toBe(false);
  });

  it('should set isEditView to true', () => {
    component.params = { mock: 'key' };
    const spy = spyOn(component, 'updateState');

    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
    expect(component.isEditView).toBe(true);
  });

  it('should set include state to true', () => {
    const includes = { category_ids: [1, 2, 3] };

    component.params = includes;

    component.ngOnInit();

    expect(component.state.include).toBe(true);
    expect(component.selectedFilter.action).toEqual('category_ids');
  });

  it('should set include state to false', () => {
    const excludes = { x_category_ids: [1, 2, 3] };

    component.params = excludes;

    component.ngOnInit();
    expect(component.state.include).toBe(false);
    expect(component.selectedFilter.action).toEqual('x_category_ids');
  });

  it('should load categories', () => {
    fixture.detectChanges();
    component.loadCategories();

    component.items$.subscribe((res) => {
      expect(res.length).toBe(1);
      expect(res[0].selected).toBe(false);
      expect(component.multiSelectPlaceholder).toEqual('');
    });

    const sentParams = serviceSpy.calls.allArgs()[0].toString();
    const expectedParams = new HttpParams()
      .set('school_id', component.session.g.get('school').id)
      .toString();

    expect(serviceSpy).toHaveBeenCalled();
    expect(sentParams).toEqual(expectedParams);
  });

  it('should create a string with all items marked as selected', () => {
    const items = [
      { label: 'Hello', selected: true },
      { label: 'World', selected: true },
      { label: '!', selected: false }
    ];
    component.updateMultiSelectPlaceholder(items);

    const result = component.multiSelectPlaceholder;
    const expected = 'Hello, World';

    expect(result).toBe(expected);
  });

  it('set items as selected', () => {
    component.isEditView = true;
    component.params = { include: [1, 2, 3] };

    const items = [
      { label: 'Hello', action: 1 },
      { label: 'World', action: 2 },
      { label: '!', action: 4 }
    ];

    const expected = [
      { label: 'Hello', action: 1, selected: true },
      { label: 'World', action: 2, selected: true },
      { label: '!', action: 4, selected: false }
    ];
    const result = component.updateItems(items);

    expect(expected).toEqual(result);
  });

  it('should update state and emit', () => {
    spyOn(component, 'doEmit');

    component.onSelected({ action: 'category_ids' });

    expect(component.doEmit).toHaveBeenCalled();
    expect(component.state.include).toBe(true);
  });

  it('should reset multiselect component', () => {
    spyOn(component, 'doEmit');
    spyOn(component.multiSelect, 'reset');

    component.onSelected({ action: 'x_category_ids' });
    expect(component.doEmit).toHaveBeenCalled();
    expect(component.state.include).toBe(false);
    expect(component.multiSelect.reset).toHaveBeenCalled();
    expect(component.state.selection).toEqual([]);
    expect(component.multiSelectPlaceholder).toBeNull();
  });

  it('should emit right values', () => {
    spyOn(component.selected, 'emit');

    component.doEmit();

    const expected = {
      meta: {
        is_system: 1,
        link_params: { category_ids: [] },
        open_in_browser: 0,
        link_url: 'oohlala://campus_service_list'
      }
    };

    expect(component.selected.emit).toHaveBeenCalledWith(expected);
  });

  it('should update state with selection', () => {
    const expected = [1, 2, 3];
    spyOn(component, 'doEmit');

    component.onMultiSelect(expected);

    expect(component.doEmit).toHaveBeenCalled();
    expect(component.state.selection).toEqual(expected);
  });
});
