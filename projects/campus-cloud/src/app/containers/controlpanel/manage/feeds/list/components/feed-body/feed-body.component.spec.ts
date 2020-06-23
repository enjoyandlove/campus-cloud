import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { mockFeed } from '@controlpanel/manage/feeds/tests';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';
import { FeedBodyComponent } from '@controlpanel/manage/feeds/list/components';
import { FeedsUtilsService } from '@controlpanel/manage/feeds/feeds.utils.service';
import { FeedsAmplitudeService } from '@controlpanel/manage/feeds/feeds.amplitude.service';
import { mockViewCommentProperties } from '@controlpanel/manage/feeds/tests/mockAmplitude';

describe('FeedBodyComponent', () => {
  configureTestSuite();

  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        imports: [CPTestModule],
        providers: [FeedsUtilsService, FeedsAmplitudeService],
        declarations: [FeedBodyComponent],
        schemas: [NO_ERRORS_SCHEMA]
      });

      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail)
  );

  let spy;
  let eventProperties;
  let component: FeedBodyComponent;
  let fixture: ComponentFixture<FeedBodyComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedBodyComponent);
    component = fixture.componentInstance;

    component.feed = mockFeed;
    spy = spyOn(component.cpTracking, 'amplitudeEmitEvent');
    eventProperties = {
      ...mockViewCommentProperties
    };
    spyOn(component.feedsAmplitudeService, 'getWallCommonAmplitudeProperties').and.returnValues(
      eventProperties
    );
  });
});
