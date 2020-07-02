import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CPSession } from '@campus-cloud/session';
import { mockUser } from '@campus-cloud/session/mock';
import { CPTestModule } from '@campus-cloud/shared/tests';
import { mockFeed } from '@controlpanel/manage/feeds/tests';
import { FeedDeletedByComponent } from './feed-deleted-by.component';

describe('FeedDeletedByComponent', () => {
  let session: CPSession;
  let component: FeedDeletedByComponent;
  let fixture: ComponentFixture<FeedDeletedByComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CPTestModule],
      declarations: [FeedDeletedByComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedDeletedByComponent);
    component = fixture.componentInstance;

    component.feed = mockFeed;

    session = TestBed.inject(CPSession);
    session.g.set('user', mockUser);

    fixture.detectChanges();
  });

  describe('message', () => {
    it('should be undefined if feed does not contain needed params', () => {
      expect(component.message).toBeUndefined();
    });

    it('should return you when deleted by current user', () => {
      const name = 'name';
      const email = session.g.get('user').email;

      component.feed = {
        ...mockFeed,
        deleter: {
          email: email,
          name: name
        }
      };

      fixture.detectChanges();
      component.ngOnInit();

      expect(component.message).toBe('you');
    });

    it('should return user name and email', () => {
      const name = 'name';
      const email = 'email';

      component.feed = {
        ...mockFeed,
        deleter: {
          email: email,
          name: name
        }
      };

      fixture.detectChanges();
      component.ngOnInit();

      expect(component.message).toBe(`[NOTRANSLATE]${name} (${email})[NOTRANSLATE]`);
    });
  });
});
