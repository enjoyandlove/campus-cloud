import { RouterTestingModule } from '@angular/router/testing';
import { TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

import { DealsModule } from '../../deals.module';
import { CPTestModule } from '@campus-cloud/shared/tests';
import { DealsFormComponent } from './deals-form.component';

describe('DealsFormComponent', () => {
  let component: DealsFormComponent;
  const mockDate = 1234567890;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CPTestModule, DealsModule, RouterTestingModule],
      providers: [DealsFormComponent]
    });
    component = TestBed.get(DealsFormComponent);
    component.form = new FormBuilder().group({
      ongoing: [false],
      expiration: [mockDate]
    });
    component.postingEndDatePickerOptions = {};
  });

  it('should toggleOngoing true', () => {
    component.toggleOngoing();
    expect(component.form.controls.ongoing.value).toBe(true);
    expect(component.form.controls.expiration.value).toBe(-1);
  });

  it('should save expiration after toggleOngoing', () => {
    component.toggleOngoing();
    component.toggleOngoing();
    expect(component.form.controls.ongoing.value).toBe(false);
    expect(component.form.controls.expiration.value).toBe(mockDate);
  });
});
