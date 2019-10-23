import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { CPSession } from '@campus-cloud/session';
import { mockSchool } from '@campus-cloud/session/mock/school';
import { EventsFormComponent } from './events-form.component';
import { EventsModel } from '@controlpanel/manage/events/model/events.model';
import { configureTestSuite, CPTestModule, MOCK_IMAGE } from '@campus-cloud/shared/tests';
import { ImageService, StoreService, ImageValidatorService } from '@campus-cloud/shared/services';

describe('EventsFormComponent', () => {
  configureTestSuite();

  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        declarations: [EventsFormComponent],
        providers: [StoreService, ImageService, ImageValidatorService],
        imports: [CPTestModule],
        schemas: [NO_ERRORS_SCHEMA]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let session;
  let fixture: ComponentFixture<EventsFormComponent>;
  let component: EventsFormComponent;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EventsFormComponent);
    component = fixture.componentInstance;

    session = TestBed.get(CPSession);
    session.g.set('school', mockSchool);
    component.form = EventsModel.form(false);
  }));

  it('should toggle is_all_day', () => {
    component.onAllDayToggle(true);
    expect(component.form.get('is_all_day').value).toBeTruthy();

    component.onAllDayToggle(false);
    expect(component.form.get('is_all_day').value).toBeFalsy();
  });

  it('should upload image', () => {
    spyOn(component.amplitudeProperties, 'emit');

    component.onUploadedImage(MOCK_IMAGE);

    expect(component.amplitudeProperties.emit).toHaveBeenCalled();
    expect(component.form.get('poster_url').value).toEqual(MOCK_IMAGE);
    expect(component.form.get('poster_thumb_url').value).toEqual(MOCK_IMAGE);
  });

  it('should set host on host select', () => {
    const host = { label: null, value: 1 };
    spyOn(component.selectHost, 'emit');
    spyOn(component.amplitudeProperties, 'emit');

    component.onSelectedHost(host);

    expect(component.selectHost.emit).toHaveBeenCalled();
    expect(component.amplitudeProperties.emit).toHaveBeenCalled();
    expect(component.form.get('store_id').value).toEqual(host.value);
  });
});
