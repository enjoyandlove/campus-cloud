import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceSelectorButtonComponent } from './resource-selector-button.component';

describe('ResourceSelectorButtonComponent', () => {
  let component: ResourceSelectorButtonComponent;
  let fixture: ComponentFixture<ResourceSelectorButtonComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [ResourceSelectorButtonComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceSelectorButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
