import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuDotComponent } from './menu-dot.component';

describe('MenuDotComponent', () => {
  let component: MenuDotComponent;
  let fixture: ComponentFixture<MenuDotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuDotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuDotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
