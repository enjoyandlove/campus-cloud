import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { CPI18nService } from '@campus-cloud/shared/services';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { ResourceSelectorTypeExternalComponent } from './resource-selector-type-external.component';
import { ResourceExternalAppOpenModule } from './../resource-external-app-open/resource-external-app-open.module';

describe('ResourceSelectorTypeExternalComponent', () => {
  let component: ResourceSelectorTypeExternalComponent;
  let fixture: ComponentFixture<ResourceSelectorTypeExternalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [CPI18nService],
      imports: [ReactiveFormsModule, SharedModule, ResourceExternalAppOpenModule],
      declarations: [ResourceSelectorTypeExternalComponent]
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
