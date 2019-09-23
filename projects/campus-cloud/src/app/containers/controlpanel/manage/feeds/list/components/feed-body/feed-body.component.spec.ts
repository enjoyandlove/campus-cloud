import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { mockFeed } from '@controlpanel/manage/feeds/tests';
import { CP_TRACK_TO } from '@campus-cloud/shared/directives';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';
import { FeedBodyComponent } from '@controlpanel/manage/feeds/list/components';
import { FeedsUtilsService } from '@controlpanel/manage/feeds/feeds.utils.service';

describe('FeedBodyComponent', () => {
  configureTestSuite();

  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        imports: [CPTestModule],
        providers: [FeedsUtilsService],
        declarations: [FeedBodyComponent],
        schemas: [NO_ERRORS_SCHEMA]
      });

      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail)
  );

  let spy;
  let component: FeedBodyComponent;
  let fixture: ComponentFixture<FeedBodyComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedBodyComponent);
    component = fixture.componentInstance;

    component.feed = mockFeed;
    component.isCampusWallView = new BehaviorSubject({ type: 1 });
    spy = spyOn(component.cpTracking, 'amplitudeEmitEvent');
  });

  it('should track viewed comment event', () => {
    component.trackEvent(true);

    const eventName = amplitudeEvents.WALL_VIEWED_COMMENT;
    const eventProperties = {
      post_id: 548942,
      likes: 'No',
      comments: 'No',
      wall_page: 'Wall',
      upload_image: 'No',
      wall_source: 'Other Walls',
      campus_wall_category: 'mock name'
    };

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(eventName, eventProperties);
  });

  it('should track viewed light box event', () => {
    component.trackViewLightBoxEvent();

    const eventProperties = {
      likes: 'No',
      wall_page: 'Wall',
      message_type: 'Post',
      wall_source: 'Other Walls',
      campus_wall_category: 'mock name'
    };

    const expected = {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: amplitudeEvents.WALL_CLICKED_IMAGE,
      eventProperties: eventProperties
    };

    expect(component.viewImageEventData).toEqual(expected);
  });
});
