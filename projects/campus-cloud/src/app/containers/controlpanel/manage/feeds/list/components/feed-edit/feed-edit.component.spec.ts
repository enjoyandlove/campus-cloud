import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { CPI18nPipe } from '@campus-cloud/shared/pipes';
import { FeedEditComponent } from './feed-edit.component';
import { CPTestModule } from '@campus-cloud/shared/tests';
import { mockFeed } from '@controlpanel/manage/feeds/tests';
import { FeedsService } from '@controlpanel/manage/feeds/feeds.service';
import { FeedsUtilsService } from '@controlpanel/manage/feeds/feeds.utils.service';
import { FeedsAmplitudeService } from '@controlpanel/manage/feeds/feeds.amplitude.service';

class MockFeedsService {}

describe('FeedEditComponent', () => {
  let component: FeedEditComponent;
  let fixture: ComponentFixture<FeedEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        CPI18nPipe,
        FeedsUtilsService,
        FeedsAmplitudeService,
        { provide: FeedsService, useClass: MockFeedsService },
        provideMockStore()
      ],
      imports: [CPTestModule, ReactiveFormsModule],
      declarations: [FeedEditComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedEditComponent);
    component = fixture.componentInstance;

    component.feed = mockFeed;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
