import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalService } from '@ready-education/ready-ui/overlays';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpParams } from '@angular/common/http';
import { of } from 'rxjs';

import { CPSession } from '@campus-cloud/session';
import { mockSchool } from '@campus-cloud/session/mock';
import { CPTestModule } from '@campus-cloud/shared/tests';
import { mockFeed } from '@controlpanel/manage/feeds/tests';
import { InteractionLikeType } from '@campus-cloud/services';
import { FeedInteractionsComponent } from './feed-interactions.component';
import { FeedsUtilsService } from '@controlpanel/manage/feeds/feeds.utils.service';
import { FeedsAmplitudeService } from '@controlpanel/manage/feeds/feeds.amplitude.service';

describe('FeedInteractionsComponent', () => {
  let session: CPSession;
  let component: FeedInteractionsComponent;
  let fixture: ComponentFixture<FeedInteractionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CPTestModule],
      providers: [
        ModalService,
        FeedsUtilsService,
        FeedsAmplitudeService,
        provideMockStore({
          initialState: {
            WALLS_STATE: {
              feeds: {}
            }
          }
        })
      ],
      declarations: [FeedInteractionsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedInteractionsComponent);
    component = fixture.componentInstance;
    component.feed = mockFeed;

    session = TestBed.inject(CPSession);
    session.g.set('school', mockSchool);
    fixture.detectChanges();
  });

  describe('fetch', () => {
    let spy: jasmine.Spy;
    const acceptedParams = ['content_id', 'like_type', 'content_type', 'school_id', 'group_id'];

    beforeEach(() => {
      spy = spyOn(component.service, 'get');
      spy.and.returnValue(of([]));
    });

    it('it request first five items', (done) => {
      component.likeType = InteractionLikeType.like;
      fixture.detectChanges();

      const sub = component.fetch();

      sub.subscribe(() => {
        const [_, endRange, params] = spy.calls.mostRecent().args as [number, number, HttpParams];
        expect(endRange).toBe(5);
        done();
      });
    });

    it('should have accepted params', (done) => {
      component.likeType = InteractionLikeType.like;
      fixture.detectChanges();

      const sub = component.fetch();

      sub.subscribe(() => {
        const [, , params] = spy.calls.mostRecent().args as [number, number, HttpParams];
        expect(params.keys().length).toEqual(acceptedParams.length);
        acceptedParams.forEach((p) =>
          expect(params.get(p)).toBeDefined(`missing expected param ${p}`)
        );
        expect(params.get('content_id')).toBe(component.feed.id.toString());
        expect(params.get('like_type')).toBe(component.likeType.toString());
        done();
      });
    });

    it('should send group_id when group is present', (done) => {
      const mockGroupId = 1;
      component.likeType = InteractionLikeType.like;
      (component.feed as any).group_id = mockGroupId;
      component.filters$ = of({ group: { ...mockFeed } } as any);

      fixture.detectChanges();

      const sub = component.fetch();

      sub.subscribe(() => {
        const [, , params] = spy.calls.mostRecent().args as [number, number, HttpParams];
        expect(params.get('school_id')).toBe(null);
        expect(params.get('group_id')).toBe(mockGroupId.toString());
        done();
      });
    });
  });
});
