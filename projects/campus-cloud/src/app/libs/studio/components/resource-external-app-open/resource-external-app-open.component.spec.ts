import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { CPI18nService } from '@campus-cloud/shared/services';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { CampusLink } from '@controlpanel/customise/personas/tiles/tile';
import { IExternalAppOpenFormDetails } from './external-app-open.interface';
import { ResourceExternalAppOpenModule } from './resource-external-app-open.module';
import { PersonasResourceExternalAppOpenComponent } from './resource-external-app-open.component';
import {
  ThirdPartyIds,
  ResourceExternalAppOpenUtils
} from './resource-external-app-open.utils.service';

const emptyForm = {
  link_type: CampusLink.linkType.appOpen,
  link_url: CampusLink.appOpen,
  link_params: {
    android: {
      fallback_http_url: '',
      package_name: ''
    },
    ios: {
      fallback_http_url: '',
      app_link: ''
    }
  }
};

const validForm = {
  link_type: CampusLink.linkType.appOpen,
  link_url: CampusLink.appOpen,
  link_params: {
    android: {
      fallback_http_url: 'fallback_http_url',
      package_name: 'package_name'
    },
    ios: {
      fallback_http_url: 'fallback_http_url',
      app_link: 'app_link'
    }
  }
};

describe('PersonasResourceExternalAppOpenComponent', () => {
  let component: PersonasResourceExternalAppOpenComponent;
  let fixture: ComponentFixture<PersonasResourceExternalAppOpenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [CPI18nService],
      imports: [SharedModule, ReactiveFormsModule, ResourceExternalAppOpenModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonasResourceExternalAppOpenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an empty form ', () => {
    expect(component.getForm().value).toEqual(emptyForm);
  });

  it('should validate android form control', () => {
    const android = component.form.get('link_params').get('android');
    const fields = ['package_name', 'fallback_http_url'];

    fields.forEach((f) => android.get(f).setValue(''));
    expect(android.valid).toBe(false);

    fields.forEach((f) => android.get(f).setValue('valid'));
    expect(android.valid).toBe(true);
  });

  it('should validate ios form control', () => {
    const ios = component.form.get('link_params').get('ios');
    const fields = ['app_link', 'fallback_http_url'];

    fields.forEach((f) => ios.get(f).setValue(''));
    expect(ios.valid).toBe(false);

    fields.forEach((f) => ios.get(f).setValue('valid'));
    expect(ios.valid).toBe(true);
  });

  it('should emit selected on form value changes, with form value when form is valid', () => {
    spyOn(component.valueChanges, 'emit');
    component.form.setValue(validForm);

    expect(component.valueChanges.emit).toHaveBeenCalled();
    expect(component.valueChanges.emit).toHaveBeenCalledWith(validForm);
  });

  it('should emit selected on form value changes, with link_url: {} when form is invalid', () => {
    spyOn(component.valueChanges, 'emit');
    component.form.setValue(emptyForm);

    expect(component.valueChanges.emit).toHaveBeenCalled();
    expect(component.valueChanges.emit).toHaveBeenCalledWith({
      ...component.form.value,
      link_url: null
    });
  });

  it('should have a set of shortcut options to chooose from', () => {
    expect(component.options).toBeDefined();
    expect(component.options.length).toBeGreaterThan(1);
  });

  describe('onOptionSelected', () => {
    let linkParamsReset: jasmine.Spy;
    const selection = {
      label: 'label',
      action: null
    };

    beforeEach(() => {
      linkParamsReset = spyOn(component.form.get('link_params'), 'reset');
      component.form.reset();
      linkParamsReset.calls.reset();
    });

    it('should reset form if selection action is null', () => {
      component.onOptionSelected(selection);
      expect(linkParamsReset).toHaveBeenCalled();
    });

    it('should reset form if selection action does not exist in Utils service', () => {
      component.onOptionSelected({
        ...selection,
        action: 'invalid'
      });
      expect(linkParamsReset).toHaveBeenCalled();
    });

    it('should update forms link params control with selection values', () => {
      component.onOptionSelected({
        ...selection,
        action: ThirdPartyIds.blackboardLearn
      });
      expect(linkParamsReset).not.toHaveBeenCalled();

      const result = component.form.get('link_params').value;
      const expected =
        ResourceExternalAppOpenUtils.thirdPartyShortcuts[ThirdPartyIds.blackboardLearn];

      expect(result).toEqual(expected);
    });
  });
});
