import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@campus-cloud/shared/shared.module';
import { PersonasResourceExternalAppOpenComponent } from './../resource-external-app-open';
import { ResourceSelectorTypeExternalComponent } from './resource-selector-type-external.component';

describe('ResourceSelectorTypeExternalComponent', () => {
  let component: ResourceSelectorTypeExternalComponent;
  let fixture: ComponentFixture<ResourceSelectorTypeExternalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, SharedModule],
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
