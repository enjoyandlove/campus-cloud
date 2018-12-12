import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { mockLocations } from '../../tests';
import { LocationModel } from '../../model';
import { SharedModule } from '@shared/shared.module';
import { configureTestSuite } from '@app/shared/tests';
import { LocationsUtilsService, ScheduleDays } from '../../locations.utils';
import { LocationOpeningHoursFormComponent } from './location-opening-hours-form.component';

const mockTime = {
  value: 1800,
  label: '12:30 AM'
};

const mockSchedule = [
  {
    day: ScheduleDays.Tuesday,
    items: [
      {
        start_time: 61200,
        end_time: 32400
      }
    ]
  }
];

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
    component.location = new LocationModel({...mockLocations[0]});

    component.schedule = mockSchedule;

    spyOn(component.formState, 'emit');

    component.ngOnInit();

    component.location.buildSchedule(component.schedule);
  });

  it('should init', () => {
    expect(component).toBeTruthy();
  });

  it('should get selected time', () => {
    const selectedTime  = component.getSelectedTime(mockTime.value);

    expect(selectedTime).toEqual(mockTime);
  });

  it('should set start end time', () => {
    const index = 1;
    const openingHour = component.openingHours[1];

    let key = 'start_time';

    component.onTimeSelected(mockTime, openingHour, key, index);

    let formSchedule = component.location.form.value['schedule'];

    expect(component.formState.emit).toHaveBeenCalled();
    expect(formSchedule[0]['items'][0][key]).toEqual(mockTime.value);
    expect(component.openingHours[1].items[0][key]).toEqual(mockTime.value);
    expect(component.formState.emit).toHaveBeenCalledWith(component.openingHours);

    key = 'end_time';

    component.onTimeSelected(mockTime, openingHour, key, index);

    formSchedule = component.location.form.value['schedule'];

    expect(component.formState.emit).toHaveBeenCalled();
    expect(formSchedule[0]['items'][0][key]).toEqual(mockTime.value);
    expect(component.openingHours[1].items[0][key]).toEqual(mockTime.value);
    expect(component.formState.emit).toHaveBeenCalledWith(component.openingHours);
  });

  it('should add form control', () => {
    const index = 1;

    component.onDayCheck(true, mockSchedule[0], index);

    const formSchedule = component.location.form.value['schedule'];

    const day = formSchedule[0]['day'];
    const endTime = formSchedule[0]['items'][0]['end_time'];
    const startTime = formSchedule[0]['items'][0]['start_time'];

    expect(day).toEqual(mockSchedule[0]['day']);
    expect(component.formState.emit).toHaveBeenCalled();
    expect(endTime).toEqual(mockSchedule[0]['items'][0].end_time);
    expect(startTime).toEqual(mockSchedule[0]['items'][0].start_time);
    expect(component.openingHours[index]['is_checked']).toBe(true);
    expect(component.formState.emit).toHaveBeenCalledWith(component.openingHours);
  });

  it('should remove from control', () => {
    const index = 1;

    component.onDayCheck(false, mockSchedule[0], index);

    const formSchedule = component.location.form.value['schedule'];

    expect(formSchedule).toEqual([]);
    expect(component.formState.emit).toHaveBeenCalled();
    expect(component.openingHours[index]['is_checked']).toBe(false);
    expect(component.formState.emit).toHaveBeenCalledWith(component.openingHours);
  });
});
