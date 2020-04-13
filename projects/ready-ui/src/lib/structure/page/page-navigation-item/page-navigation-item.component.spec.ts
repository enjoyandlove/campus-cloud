import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageNavigationItemComponent } from './page-navigation-item.component';

describe('PageNavigationItemComponent', () => {
  let component: PageNavigationItemComponent;
  let fixture: ComponentFixture<PageNavigationItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageNavigationItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageNavigationItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
