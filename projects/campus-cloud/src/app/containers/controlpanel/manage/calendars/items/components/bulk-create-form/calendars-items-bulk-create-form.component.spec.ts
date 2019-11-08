import { TestBed, ComponentFixture, async, fakeAsync, tick } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { FormArray, FormGroup } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { mockCalendarItemForm } from '@controlpanel/manage/calendars/tests/mocks';
import { ImageService, ImageValidatorService } from '@campus-cloud/shared/services';
import { configureTestSuite, CPTestModule, MOCK_IMAGE } from '@campus-cloud/shared/tests';
import { CalendarsItemsBulkCreateFormComponent } from './calendars-items-bulk-create-form.component';

describe('CalendarsItemsBulkCreateFormComponent', () => {
  configureTestSuite();

  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        declarations: [CalendarsItemsBulkCreateFormComponent],
        providers: [ImageService, ImageValidatorService, provideMockStore()],
        imports: [CPTestModule],
        schemas: [NO_ERRORS_SCHEMA]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let fixture: ComponentFixture<CalendarsItemsBulkCreateFormComponent>;
  let component: CalendarsItemsBulkCreateFormComponent;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CalendarsItemsBulkCreateFormComponent);
    component = fixture.componentInstance;

    component.form = mockCalendarItemForm;
  }));

  it('should remove image from item', () => {
    const index = 0;
    component.onRemoveImage(index);

    const eventControl = <FormArray>component.form.controls['items'];
    const control = <FormGroup>eventControl.at(index);

    expect(control.get('poster_url').value).toBeNull();
    expect(control.get('poster_thumb_url').value).toBeNull();
  });

  it('should upload image', fakeAsync(() => {
    spyOn(component.imageService, 'upload').and.returnValue(of({ image_url: MOCK_IMAGE }));
    const index = 0;
    const mockFile = new File([''], MOCK_IMAGE);

    component.onImageUpload(mockFile, index);

    tick();

    const eventControl = <FormArray>component.form.controls['items'];
    const control = <FormGroup>eventControl.at(index);

    expect(control.get('poster_url').value).toEqual(MOCK_IMAGE);
    expect(control.get('poster_thumb_url').value).toEqual(MOCK_IMAGE);
  }));

  it('should submit form', () => {
    spyOn(component.submitted, 'emit');

    component.onSubmit();

    expect(component.buttonData.disabled).toBe(false);
    expect(component.submitted.emit).toHaveBeenCalled();
    expect(component.submitted.emit).toHaveBeenCalledWith(component.form.value);
  });
});
