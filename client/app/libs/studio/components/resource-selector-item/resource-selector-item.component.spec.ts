import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceSelectorItemComponent } from './resource-selector-item.component';

describe('ResourceSelectorItemComponent', () => {
  let component: ResourceSelectorItemComponent;
  let fixture: ComponentFixture<ResourceSelectorItemComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [ResourceSelectorItemComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceSelectorItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
