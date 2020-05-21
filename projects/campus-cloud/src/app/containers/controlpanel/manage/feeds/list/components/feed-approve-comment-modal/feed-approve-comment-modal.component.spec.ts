import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { BehaviorSubject, of } from 'rxjs';

import { mockFeed } from '@controlpanel/manage/feeds/tests';
import { FeedsService } from '@controlpanel/manage/feeds/feeds.service';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';
import { FeedsUtilsService } from '@controlpanel/manage/feeds/feeds.utils.service';
import { FeedsAmplitudeService } from '@controlpanel/manage/feeds/feeds.amplitude.service';
import { FeedApproveCommentModalComponent } from '@controlpanel/manage/feeds/list/components';

describe('FeedApproveCommentModalComponent', () => {
  configureTestSuite();

  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        imports: [CPTestModule],
        providers: [FeedsService, FeedsUtilsService, FeedsAmplitudeService],
        declarations: [FeedApproveCommentModalComponent],
        schemas: [NO_ERRORS_SCHEMA]
      });

      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail)
  );

  let closeButton: HTMLSpanElement;
  let cancelButton: HTMLButtonElement;
  let component: FeedApproveCommentModalComponent;
  let fixture: ComponentFixture<FeedApproveCommentModalComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedApproveCommentModalComponent);
    component = fixture.componentInstance;

    component.feed = mockFeed;
    component.isCampusWallView = new BehaviorSubject({ type: 1 });

    const closeButtonDebugEl = fixture.debugElement.query(By.css('.cpmodal__header__close'));

    const cancelButtonDebugEl = fixture.debugElement.query(By.css('.cpbtn--cancel'));

    closeButton = closeButtonDebugEl.nativeElement;
    cancelButton = cancelButtonDebugEl.nativeElement;

    fixture.detectChanges();

    spyOn(component.teardown, 'emit');
    spyOn(component.approved, 'emit');
  });

  it('should call teardown on close button click', () => {
    closeButton.click();

    expect(component.teardown.emit).toHaveBeenCalled();
    expect(component.teardown.emit).toHaveBeenCalledTimes(1);
  });

  it('should call teardown on cancel button click', () => {
    cancelButton.click();

    expect(component.teardown.emit).toHaveBeenCalled();
    expect(component.teardown.emit).toHaveBeenCalledTimes(1);
  });

  it('should approve comment onSubmit', () => {
    spyOn(component.feedsService, 'updateGroupWallComment').and.returnValue(of({}));
    spyOn(component.feedsService, 'updateCampusWallComment').and.returnValue(of({}));

    component.onSubmit();

    expect(component.buttonData.disabled).toBe(false);
    expect(component.approved.emit).toHaveBeenCalled();
    expect(component.teardown.emit).toHaveBeenCalled();
    expect(component.approved.emit).toHaveBeenCalledWith(mockFeed.id);
  });
});
