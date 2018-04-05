import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrientationListComponent } from './list.component';

describe('OrientationListComponent', () => {
  let component: OrientationListComponent;
  let fixture: ComponentFixture<OrientationListComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [OrientationListComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OrientationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
