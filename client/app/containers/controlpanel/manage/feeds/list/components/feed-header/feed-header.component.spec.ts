import { UserStatus } from './../../feeds.status';
import { By } from '@angular/platform-browser';
import { CPSession } from './../../../../../../../session/index';
import { SharedModule } from './../../../../../../../shared/shared.module';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FeedsModule } from './../../../feeds.module';
import { FeedHeaderComponent } from './feed-header.component';
import { CPI18nService } from '../../../../../../../shared/services';

class MockCPSession {
  get tz() {
    return 'America/Toronto';
  }
}

const mockFeed = {
  image_list: [],
  post_type: 1,
  likes: 0,
  message: 'yay2',
  id: 548942,
  user_status: 1,
  display_name: 'a a',
  comment_count: 0,
  added_time: 1525453832,
  avatar_thumb: 'https://d3tlp0m01b6d9o.cloudfront.net/defaultavatar_2016.png',
  school_id: 157,
  last_comment_time: 0,
  dislikes: 0,
  image_thumb_url: '',
  flag: 0,
  extern_poster_id: 0,
  user_id: 388713,
  image_url_list: [''],
  is_global: false,
  is_anonymous: false,
  email: 'sebastien@oohlalamobile.com',
  image_url: '',
  has_image: false
};

describe('FeedHeaderComponent', () => {
  let comp: FeedHeaderComponent;
  let fixture: ComponentFixture<FeedHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CPI18nService, { provide: CPSession, useClass: MockCPSession }],
      imports: [FeedsModule, SharedModule]
    });

    fixture = TestBed.createComponent(FeedHeaderComponent);
    comp = fixture.componentInstance;
    comp.feed = mockFeed;
  });

  it('should build', () => {
    expect(comp).toBeTruthy();
  });

  it('should display email address if user status is active', () => {
    fixture.detectChanges();

    const emailField = fixture.debugElement.query(By.css('.email'));
    const emailSpan: HTMLElement = emailField.nativeElement;

    expect(emailSpan.textContent.trim()).toEqual(`(${mockFeed.email})`);
  });

  it('should not display email address when user status is deleted', () => {
    const feedWithDisabledUser = { ...mockFeed, user_status: UserStatus.deleted };
    comp.feed = feedWithDisabledUser;

    fixture.detectChanges();

    const emailField = fixture.debugElement.query(By.css('.email'));
    const emailSpan: HTMLElement = emailField.nativeElement;

    expect(emailSpan.textContent.trim()).not.toEqual(`(${mockFeed.email})`);
  });

  it('should display email address when user status is active but the email is unverified', () => {
    const feedWithDisabledUser = { ...mockFeed, user_status: UserStatus.activeWithUnverifiedEmail };
    comp.feed = feedWithDisabledUser;

    fixture.detectChanges();

    const emailField = fixture.debugElement.query(By.css('.email'));
    const emailSpan: HTMLElement = emailField.nativeElement;

    expect(emailSpan.textContent.trim()).toEqual(`(${mockFeed.email})`);
  });
});
