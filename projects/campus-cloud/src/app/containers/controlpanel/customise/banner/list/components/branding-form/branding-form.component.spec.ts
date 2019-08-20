import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { CPSession } from '@campus-cloud/session';
import { BannerModule } from '../../../banner.module';
import { CPI18nService } from '@campus-cloud/shared/services';
import { BrandingFormComponent } from './branding-form.component';
import { configureTestSuite, MOCK_IMAGE } from '@campus-cloud/shared/tests';

describe('BrandingFormComponent', () => {
  configureTestSuite();
  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        providers: [CPSession, CPI18nService],
        imports: [BannerModule]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let de: DebugElement;
  let component: BrandingFormComponent;
  let fixture: ComponentFixture<BrandingFormComponent>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BrandingFormComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;

    component.form = new FormBuilder().group({
      logo_url: MOCK_IMAGE,
      branding_color: '0076FF',
      school_name_logo_url: MOCK_IMAGE
    });

    fixture.detectChanges();
  }));

  it('should change color', () => {
    const spy = spyOn(component.changeColor, 'emit');
    const colorInput = de.query(By.css('[data-target="branding_color"]')).nativeElement;

    colorInput.value = 'FFFFFF';
    colorInput.dispatchEvent(new Event('input'));

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('FFFFFF');
  });

  it('should emit upload', () => {
    const spy = spyOn(component.uploadLogo, 'emit');
    const uploadInput = de.query(By.css('[data-target="upload_school_logo"]')).nativeElement;

    uploadInput.dispatchEvent(new Event('fileUpload'));

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should emit remove', () => {
    const spy = spyOn(component.removeLogo, 'emit');
    const uploadInput = de.query(By.css('[data-target="remove_school_logo"]')).nativeElement;

    uploadInput.dispatchEvent(new Event('click'));

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
