import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, BehaviorSubject } from 'rxjs';
import { FormArray } from '@angular/forms';
import { omit } from 'lodash';

import { CPSession } from '@campus-cloud/session';
import { mockSchool } from '@campus-cloud/session/mock';
import { mockFeedGroup } from '@controlpanel/manage/feeds/tests';
import { FeedsService } from '@controlpanel/manage/feeds/feeds.service';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';
import { FeedSettingsComponent } from '@controlpanel/manage/feeds/list/components';
import { FeedsUtilsService } from '@controlpanel/manage/feeds/feeds.utils.service';

describe('FeedSettingsComponent', () => {
  configureTestSuite();

  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        imports: [CPTestModule],
        providers: [FeedsService, FeedsUtilsService],
        declarations: [FeedSettingsComponent],
        schemas: [NO_ERRORS_SCHEMA]
      });

      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail)
  );

  let spy;
  let session: CPSession;
  let component: FeedSettingsComponent;
  let fixture: ComponentFixture<FeedSettingsComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedSettingsComponent);
    component = fixture.componentInstance;

    component.isCampusWallView = new BehaviorSubject({ type: 1 });

    session = TestBed.get(CPSession);
    session.g.set('school', mockSchool);

    fixture.detectChanges();

    spyOn(component, 'trackAmplitudeEvent');
    spyOn(component.updateWallSettings, 'emit');
    spyOn(component.feedsService, 'getSocialGroups').and.returnValue(of([mockFeedGroup]));
    spy = spyOn(component.feedsService, 'upodateSocialGroup').and.returnValue(of(mockFeedGroup));
  });

  it('should get wall name & modal title', () => {
    const wallName = component.cpI18n.translate('feeds_wall_name');
    const modalTitle = component.cpI18n.translate('feeds_wall_settings_modal_title');

    expect(component.wallName).toEqual(wallName);
    expect(component.modalTitle).toEqual(modalTitle);
  });

  it('should add feed control', () => {
    let expected;
    component.addFeedControl(mockFeedGroup);

    const controls = <FormArray>component.form.controls['walls'];

    const result = controls.value;

    expected = omit(mockFeedGroup, ['id', 'related_obj_id']);

    expected = {
      ...expected,
      wall_id: 1
    };

    expect(result[0]).toEqual(expected);
  });

  it('should set who can post on wall', () => {
    component.addFeedControl(mockFeedGroup);

    component.onCanPostChanged(component.privileges[1], 0);

    expect(spy).toHaveBeenCalled();
    expect(component.trackAmplitudeEvent).toHaveBeenCalled();
    expect(component.updateWallSettings.emit).toHaveBeenCalled();
    expect(component.updateWallSettings.emit).toHaveBeenCalledWith(mockFeedGroup);
  });

  it('should set who can comment on wall', () => {
    component.addFeedControl(mockFeedGroup);

    component.onCanCommentChanged(component.privileges[1], 0);

    expect(spy).toHaveBeenCalled();
    expect(component.trackAmplitudeEvent).toHaveBeenCalled();
    expect(component.updateWallSettings.emit).toHaveBeenCalled();
    expect(component.updateWallSettings.emit).toHaveBeenCalledWith(mockFeedGroup);
  });
});
