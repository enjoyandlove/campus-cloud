import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormGroup } from '@angular/forms';

import { CPI18nService } from '@campus-cloud/shared/services';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { configureTestSuite } from '@campus-cloud/shared/tests';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { getElementByCPTargetValue } from '@campus-cloud/shared/utils/tests';
import { mockScheduleData } from '@campus-cloud/libs/locations/common/tests';
import { LocationsUtilsService } from '@campus-cloud/libs/locations/common/utils';
import { LocationsDayLabelPipe } from '@campus-cloud/libs/locations/common/pipes';
import { DiningModel, ScheduleModel } from '@campus-cloud/libs/locations/common/model';
import { DiningOpeningHoursFormComponent } from './dining-opening-hours-form.component';

describe('DiningOpeningHoursFormComponent', () => {
  configureTestSuite();

  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        imports: [SharedModule],
        providers: [CPI18nService],
        declarations: [DiningOpeningHoursFormComponent, LocationsDayLabelPipe],
        schemas: [NO_ERRORS_SCHEMA]
      });

      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail)
  );

  let de: DebugElement;
  let fixture: ComponentFixture<DiningOpeningHoursFormComponent>;
  let component: DiningOpeningHoursFormComponent;

  beforeEach(() => {
    fixture = TestBed.createComponent(DiningOpeningHoursFormComponent);
    component = fixture.componentInstance;

    component.diningForm = DiningModel.form();

    de = fixture.debugElement;

    LocationsUtilsService.setScheduleFormControls(component.diningForm, mockScheduleData());

    fixture.detectChanges();
  });

  it('should show add meal button if items length is not greater than three', () => {
    const addMeal = getElementByCPTargetValue(de, 'add_meal_0').nativeElement;

    expect(addMeal).not.toBeNull();
  });

  it('should not show add meal button if items length is greater than three', () => {
    const exceedMaxLength = 4;
    const scheduleControls = <FormArray>component.diningForm.controls['schedule'];
    const scheduleControl = <FormGroup>scheduleControls.controls[0];

    const itemControls = <FormArray>scheduleControl.controls['items'];

    Array.from(Array(exceedMaxLength).keys()).forEach(() => {
      itemControls.push(ScheduleModel.setItemControls());
    });

    fixture.detectChanges();

    const addMeal = getElementByCPTargetValue(de, 'add_meal_0');

    expect(addMeal).toBeNull();
  });
});
