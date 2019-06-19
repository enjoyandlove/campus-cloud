import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonasResourceExternalAppOpenComponent } from './../resource-external-app-open';
import { ResourceSelectorTypeExternalComponent } from './resource-selector-type-external.component';

describe('ResourceSelectorTypeExternalComponent', () => {
  let component: ResourceSelectorTypeExternalComponent;
  let fixture: ComponentFixture<ResourceSelectorTypeExternalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ResourceSelectorTypeExternalComponent,
        PersonasResourceExternalAppOpenComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceSelectorTypeExternalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
