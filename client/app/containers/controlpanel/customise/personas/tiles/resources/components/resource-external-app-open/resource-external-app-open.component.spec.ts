import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@shared/shared.module';
import { CampusLink } from '@controlpanel/manage/links/tile';
import { PersonasResourceExternalAppOpenComponent } from './resource-external-app-open.component';

const emptyForm = {
  android: { fallback_http_url: '', package_name: '' },
  ios: { app_link: '', fallback_http_url: '' }
};

const validForm = {
  android: { fallback_http_url: 'fallback_http_url', package_name: 'package_name' },
  ios: { app_link: 'app_link', fallback_http_url: 'fallback_http_url' }
};

describe('PersonasResourceExternalAppOpenComponent', () => {
  let component: PersonasResourceExternalAppOpenComponent;
  let fixture: ComponentFixture<PersonasResourceExternalAppOpenComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [SharedModule, ReactiveFormsModule],
        declarations: [PersonasResourceExternalAppOpenComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonasResourceExternalAppOpenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create an empty form when no params Input is present', () => {
    expect(component.form.value).toEqual(emptyForm);
  });

  it('should invalidate iOS form group when both fallback_http_url and fallback_http_url are missing', () => {
    const iOS = component.form.get('ios');
    const fields = ['fallback_http_url', 'fallback_http_url'];

    fields.forEach((f) => {
      iOS.get(f).setValue('valid');
      expect(iOS.valid).toBe(true);
      iOS.get(f).setValue('');
      expect(iOS.valid).toBe(false);
    });
  });

  it('should validate android form control', () => {
    const android = component.form.get('android');
    const fields = ['package_name', 'fallback_http_url'];

    fields.forEach((f) => android.get(f).setValue(''));
    expect(android.valid).toBe(false);

    fields.forEach((f) => android.get(f).setValue('valid'));
    expect(android.valid).toBe(true);
  });

  it('should emit selected on form value changes, with form value when form is valid', () => {
    spyOn(component.selected, 'emit');
    component.form.setValue(validForm);
    const expected = {
      link_type: 4,
      meta: {
        is_system: 1,
        link_params: {
          ...validForm
        },
        open_in_browser: 0,
        link_url: CampusLink.appOpen
      }
    };
    expect(component.selected.emit).toHaveBeenCalled();
    expect(component.selected.emit).toHaveBeenCalledWith(expected);
  });

  it('should emit selected on form value changes, with meta: {} when form is invalid', () => {
    spyOn(component.selected, 'emit');
    component.form.setValue(emptyForm);

    expect(component.selected.emit).toHaveBeenCalled();
    expect(component.selected.emit).toHaveBeenCalledWith({ meta: {} });
  });
});
