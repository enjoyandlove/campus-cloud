import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CPTestModule } from '@campus-cloud/shared/tests';
import { FeedSortingComponent } from './feed-sorting.component';

describe('FeedSortingComponent', () => {
  let component: FeedSortingComponent;
  let fixture: ComponentFixture<FeedSortingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CPTestModule],
      declarations: [FeedSortingComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedSortingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
