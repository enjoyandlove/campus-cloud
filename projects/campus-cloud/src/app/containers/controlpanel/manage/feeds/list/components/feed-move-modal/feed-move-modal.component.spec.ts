import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { CPSession } from '@campus-cloud/session';
import { mockSchool } from '@campus-cloud/session/mock';
import { mockFeed } from '@controlpanel/manage/feeds/tests';
import { FeedsService } from '@controlpanel/manage/feeds/feeds.service';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';
import { FeedMoveComponent } from '@controlpanel/manage/feeds/list/components';
import { FeedsUtilsService } from '@controlpanel/manage/feeds/feeds.utils.service';
import { FeedsAmplitudeService } from '@controlpanel/manage/feeds/feeds.amplitude.service';

describe('FeedMoveComponent', () => {
  configureTestSuite();

  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        imports: [CPTestModule],
        providers: [FeedsService, FeedsUtilsService, FeedsAmplitudeService],
        declarations: [FeedMoveComponent],
        schemas: [NO_ERRORS_SCHEMA]
      });

      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail)
  );

  let session: CPSession;
  let closeButton: HTMLSpanElement;
  let cancelButton: HTMLButtonElement;
  let component: FeedMoveComponent;
  let fixture: ComponentFixture<FeedMoveComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedMoveComponent);
    component = fixture.componentInstance;

    component.feed = mockFeed;

    session = TestBed.get(CPSession);
    session.g.set('school', mockSchool);

    const closeButtonDebugEl = fixture.debugElement.query(By.css('.cpmodal__header__close'));

    const cancelButtonDebugEl = fixture.debugElement.query(By.css('.cpbtn--cancel'));

    closeButton = closeButtonDebugEl.nativeElement;
    cancelButton = cancelButtonDebugEl.nativeElement;

    fixture.detectChanges();

    spyOn(component.moved, 'emit');
    spyOn(component.teardown, 'emit');
    spyOn(component.feedsService, 'getChannelsBySchoolId').and.returnValue(of([mockFeed]));
  });

  it('should call teardown on close button click', () => {
    closeButton.click();

    expect(component.teardown.emit).toHaveBeenCalled();
    expect(component.teardown.emit).toHaveBeenCalledTimes(1);
  });

  it('should move feed onSubmit', () => {
    spyOn(component, 'trackAmplitudeEvent');
    spyOn(component.feedsService, 'updateCampusWallThread').and.returnValue(of(mockFeed));

    component.onSubmit();

    expect(component.moved.emit).toHaveBeenCalled();
    expect(component.trackAmplitudeEvent).toHaveBeenCalled();
    expect(component.moved.emit).toHaveBeenCalledWith(mockFeed);
  });
});
