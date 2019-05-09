import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationBrandComponent } from './navigation-brand.component';

describe('NavigationBrandComponent', () => {
  let component: NavigationBrandComponent;
  let fixture: ComponentFixture<NavigationBrandComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [NavigationBrandComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationBrandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
