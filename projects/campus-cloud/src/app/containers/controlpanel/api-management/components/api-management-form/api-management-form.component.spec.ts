import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';

import { mockSchool } from '@campus-cloud/session/mock/school';
import { filledForm } from '@controlpanel/api-management/tests';
import { ApiManagementFormComponent } from './api-management-form.component';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';
import { ApiManagementUtilsService } from '../../api-management.utils.service';
import { fillForm, getElementByCPTargetValue } from '@campus-cloud/shared/utils/tests';

describe('ApiManagementFormComponent', () => {
  configureTestSuite();

  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        declarations: [ApiManagementFormComponent],
        providers: [ApiManagementUtilsService],
        imports: [CPTestModule],
        schemas: [NO_ERRORS_SCHEMA]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let spy;
  let de: DebugElement;
  let submitBtn: HTMLButtonElement;
  let fixture: ComponentFixture<ApiManagementFormComponent>;
  let component: ApiManagementFormComponent;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ApiManagementFormComponent);
    component = fixture.componentInstance;

    component.session.g.set('school', mockSchool);

    spy = spyOn(component.submitted, 'emit');

    de = fixture.debugElement;
    fixture.detectChanges();
  }));

  it('should show warnings if user is in prod', () => {
    component.isSandbox = false;

    fixture.detectChanges();

    let warningText = getElementByCPTargetValue(de, 'warning_text').nativeElement;

    expect(warningText).not.toBeNull();
  });

  it('should hide warnings if user is in sandbox', () => {
    component.isSandbox = true;

    fixture.detectChanges();

    let warningText = getElementByCPTargetValue(de, 'warning_text');

    expect(warningText).toBeNull();
  });

  it('should not submit if form is invalid', () => {
    submitBtn = getElementByCPTargetValue(de, 'submit').nativeElement;

    submitBtn.click();

    expect(spy).not.toHaveBeenCalled();
    expect(component.form.valid).toBe(false);
    expect(component.formErrors).toBe(true);
  });

  it('should submit if form is valid', () => {
    fillForm(component.form, filledForm);

    submitBtn = getElementByCPTargetValue(de, 'submit').nativeElement;

    submitBtn.click();

    expect(spy).toHaveBeenCalled();
    expect(component.form.valid).toBe(true);
    expect(component.formErrors).toBe(false);
  });
});
