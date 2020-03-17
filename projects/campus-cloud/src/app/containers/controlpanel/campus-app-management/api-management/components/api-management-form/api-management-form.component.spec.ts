import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { mockSchool } from '@campus-cloud/session/mock/school';
import { ApiManagementFormComponent } from './api-management-form.component';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';
import { ApiManagementUtilsService } from '../../api-management.utils.service';
import { ApiType } from '@controlpanel/campus-app-management/api-management/model';
import { filledForm } from '@controlpanel/campus-app-management/api-management/tests';
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

  describe('onToggle audience or experience', () => {
    it('should have campus permission if have audience or experience permissions ', () => {
      const permissionDataCtrl = component.form.get('permission_data') as FormGroup;
      permissionDataCtrl.get(ApiType.audience).setValue(true);
      permissionDataCtrl.get(ApiType.experience).setValue(true);

      component.setCampusValueAndStatus();
      const campus = permissionDataCtrl.get(ApiType.campus).value;

      expect(campus).toBe(true);
      expect(component.hasCampus).toBe(true);
    });

    it('should not have campus permission if no audience and experience permission', () => {
      const permissionDataCtrl = component.form.get('permission_data') as FormGroup;
      permissionDataCtrl.get(ApiType.audience).setValue(false);
      permissionDataCtrl.get(ApiType.experience).setValue(false);

      component.setCampusValueAndStatus();
      const campus = permissionDataCtrl.get(ApiType.campus).value;

      expect(campus).toBe(false);
      expect(component.hasCampus).toBe(false);
    });
  });

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
