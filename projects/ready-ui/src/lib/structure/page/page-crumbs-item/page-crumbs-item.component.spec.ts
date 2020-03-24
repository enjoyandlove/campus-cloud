import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageCrumbsItemComponent } from './page-crumbs-item.component';

describe('PageCrumbsItemComponent', () => {
  let component: PageCrumbsItemComponent;
  let fixture: ComponentFixture<PageCrumbsItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageCrumbsItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageCrumbsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
