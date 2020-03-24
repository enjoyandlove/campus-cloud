import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageCrumbsComponent } from './page-crumbs.component';

describe('PageCrumbsComponent', () => {
  let component: PageCrumbsComponent;
  let fixture: ComponentFixture<PageCrumbsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageCrumbsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageCrumbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
