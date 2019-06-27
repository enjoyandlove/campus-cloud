import { TestBed, ComponentFixture } from '@angular/core/testing';

import { SharedModule } from './../../shared.module';
import { CPDropdownMultiSelectComponent } from './cp-dropdown-multiselect.component';

const mockItems = [
  {
    action: null,
    label: 'Hello',
    selected: false
  },
  {
    action: 1,
    label: 'World',
    selected: false
  }
];

describe('CPDropdownMultiSelectComponent', () => {
  let comp: CPDropdownMultiSelectComponent;
  let fixture: ComponentFixture<CPDropdownMultiSelectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule]
    });

    fixture = TestBed.createComponent(CPDropdownMultiSelectComponent);
    comp = fixture.componentInstance;

    fixture.detectChanges();

    comp.items = mockItems;
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('onToggle', () => {
    spyOn(comp.selection, 'emit');

    const mockEvent = new Event('click');
    comp.onToggle(mockEvent, mockItems[0]);

    expect(comp.selection.emit).toHaveBeenCalledTimes(1);

    expect(comp.selection.emit).toHaveBeenCalledWith([mockItems[0].action]);

    expect(comp.state.label).toBe(mockItems[0].label);
  });

  it('should update labels if input contains selected items', () => {
    const mockItemsSelected = mockItems.map((item) => {
      return {
        ...item,
        selected: true
      };
    });

    comp.items = mockItemsSelected;

    comp.ngOnInit();

    expect(comp.state.label).toBe('Hello, World');
  });

  it('should update labels', () => {
    const mockItemsSelected = mockItems.map((item) => {
      return {
        ...item,
        selected: true
      };
    });

    const selected = mockItemsSelected.filter((item) => item.selected);

    comp.updateLabel(selected);

    expect(comp.state.label).toBe('Hello, World');
  });

  it('should build labels', () => {
    const mockItemsSelected = mockItems.map((item) => {
      return {
        ...item,
        selected: true
      };
    });

    const selected = mockItemsSelected.filter((item) => item.selected);

    comp.updateLabel(selected);

    expect(comp.state.label).toBe('Hello, World');
  });
});
