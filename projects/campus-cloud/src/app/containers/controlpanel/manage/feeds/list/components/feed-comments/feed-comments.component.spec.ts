import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';

import { CPSession } from '@campus-cloud/session';
import { mockSchool } from '@campus-cloud/session/mock';
import { mockFeed } from '@controlpanel/manage/feeds/tests';
import { FeedsService } from '@controlpanel/manage/feeds/feeds.service';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';
import { FeedCommentsComponent } from '@controlpanel/manage/feeds/list/components';
import { FeedsUtilsService } from '@controlpanel/manage/feeds/feeds.utils.service';
import { FeedsAmplitudeService } from '@controlpanel/manage/feeds/feeds.amplitude.service';

describe('FeedCommentsComponent', () => {
  configureTestSuite();

  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        imports: [CPTestModule],
        providers: [FeedsService, FeedsUtilsService, FeedsAmplitudeService, provideMockStore()],
        declarations: [FeedCommentsComponent],
        schemas: [NO_ERRORS_SCHEMA]
      });

      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail)
  );

  let spy;
  let session: CPSession;
  let component: FeedCommentsComponent;
  let fixture: ComponentFixture<FeedCommentsComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedCommentsComponent);
    component = fixture.componentInstance;

    session = TestBed.get(CPSession);
    session.g.set('school', mockSchool);

    component.feed = mockFeed;
    component.isCampusWallView = new BehaviorSubject({ type: 1 });
  });

  it('should emit deleted onDeleteComment', () => {
    spyOn(component.deleted, 'emit');

    component.onDeletedComment(1);

    expect(component.deleted.emit).toHaveBeenCalled();
  });

  it('should fetch comments', () => {
    spyOn(component.feedsService, 'getGroupWallCommentsByThreadId');
    spy = spyOn(component.feedsService, 'getCampusWallCommentsByThreadId').and.returnValue(
      of([mockFeed])
    );

    component.ngOnInit();

    expect(spy).toHaveBeenCalled();
    expect(component.campusGroupId).toBe(1);
    expect(component._isCampusWallView).toBe(true);
  });
});
