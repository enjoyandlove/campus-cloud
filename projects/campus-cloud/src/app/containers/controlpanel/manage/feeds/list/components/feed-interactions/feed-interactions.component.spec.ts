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

describe('FeedInteractionsComponent', () => {
  let session: CPSession;
  let component: FeedInteractionsComponent;
  let fixture: ComponentFixture<FeedInteractionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CPTestModule],
      providers: [
        ModalService,
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

    beforeEach(() => {
      spy = spyOn(component.service, 'get');
    });

    it('it should have right params', (done) => {
      spy.and.returnValue(of([]));
      component.likeType = InteractionLikeType.like;
      fixture.detectChanges();

      const sub = component.fetch();

      sub.subscribe(() => {
        const [_, endRange, params] = spy.calls.mostRecent().args as [number, number, HttpParams];
        expect(endRange).toBe(5);
        const acceptedParams = ['content_id', 'like_type', 'content_type', 'school_id', 'group_id'];
        acceptedParams.forEach((p) =>
          expect(params.get(p)).toBeDefined(`missing expected param ${p}`)
        );
        expect(params.get('content_id')).toBe(component.feed.id.toString());
        expect(params.get('like_type')).toBe(component.likeType.toString());
        done();
      });
    });
  });
});
