import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { UserStatus } from './../../feeds.status';
import { FeedsModule } from './../../../feeds.module';
import { CPTestModule } from '@campus-cloud/shared/tests';
import { mockFeed } from '@controlpanel/manage/feeds/tests';
import { FeedHeaderComponent } from './feed-header.component';

describe('FeedHeaderComponent', () => {
  let feedWithDisabledUser;
  let comp: FeedHeaderComponent;
  let fixture: ComponentFixture<FeedHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [],
      imports: [FeedsModule, CPTestModule]
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
    feedWithDisabledUser = { ...mockFeed, user_status: UserStatus.deleted };
    comp.feed = feedWithDisabledUser;

    fixture.detectChanges();

    const emailField = fixture.debugElement.query(By.css('.email'));
    const emailSpan: HTMLElement = emailField.nativeElement;

    expect(emailSpan.textContent.trim()).not.toEqual(`(${mockFeed.email})`);
  });

  it('should display email address when user status is active but the email is unverified', () => {
    feedWithDisabledUser = { ...mockFeed, user_status: UserStatus.activeWithUnverifiedEmail };
    comp.feed = feedWithDisabledUser;

    fixture.detectChanges();

    const emailField = fixture.debugElement.query(By.css('.email'));
    const emailSpan: HTMLElement = emailField.nativeElement;

    expect(emailSpan.textContent.trim()).toEqual(`(${mockFeed.email})`);
  });
});
