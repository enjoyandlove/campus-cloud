import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { configureTestSuite } from '@app/shared/tests';
import { mockTime } from '@libs/locations/common/tests';
import { LocationsUtilsService } from '@libs/locations/common/utils';
import { LocationModel, ScheduleDays, scheduleLabels } from '@libs/locations/common/model';
import { LocationOpeningHoursFormComponent } from './location-opening-hours-form.component';

describe('LocationOpeningHoursFormComponent', () => {
  configureTestSuite();

  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        imports: [SharedModule],
        providers: [LocationsUtilsService],
        declarations: [LocationOpeningHoursFormComponent],
        schemas: [NO_ERRORS_SCHEMA]
      });

      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail)
  );

  let fixture: ComponentFixture<LocationOpeningHoursFormComponent>;
  let component: LocationOpeningHoursFormComponent;

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationOpeningHoursFormComponent);
    component = fixture.componentInstance;
    component.locationForm = LocationModel.form();
    LocationsUtilsService.setScheduleFormControls(component.locationForm);

    component.ngOnInit();
  });

  it('should init', () => {
    expect(component).toBeTruthy();
  });

  it('should get selected time', () => {
    const selectedTime  = component.getSelectedTime(mockTime.value);

    expect(selectedTime).toEqual(mockTime);
  });

  it('should set start time', () => {
    const index = 0;
    const key = 'start_time';

    component.onTimeSelected(mockTime, key, index);

    const formSchedule = component.locationForm.value['schedule'];

    const itemsStartTime = formSchedule[0]['items'][0][key];

    expect(itemsStartTime).toEqual(mockTime.value);
  });

  it('should set end time', () => {
    const index = 0;
    const key = 'end_time';

    component.onTimeSelected(mockTime, key, index);

    const formSchedule = component.locationForm.value['schedule'];

    const itemsEndTime = formSchedule[0]['items'][0][key];

    expect(itemsEndTime).toEqual(mockTime.value);
  });

  it('should check opening hour day', () => {
    const index = 0;

    component.onDayCheck(true, index);

    const formSchedule = component.locationForm.value['schedule'];

    const isDayChecked = formSchedule[0].is_checked;

    expect(isDayChecked).toBe(true);
  });

  it('should uncheck opening hour day', () => {
    const index = 0;

    component.onDayCheck(false, index);

    const formSchedule = component.locationForm.value['schedule'];

    const isDayChecked = formSchedule[0].is_checked;

    expect(isDayChecked).toBe(false);
  });

  it('should get day label', () => {

    const day = component.getDayLabel(ScheduleDays.Wednesday);

    expect(day).toEqual(scheduleLabels[ScheduleDays.Wednesday]);
  });
});
