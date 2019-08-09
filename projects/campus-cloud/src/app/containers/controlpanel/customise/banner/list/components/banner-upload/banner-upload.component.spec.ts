import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { BannerModule } from '../../../banner.module';
import { BannerUploadComponent } from './banner-upload.component';
import { configureTestSuite, CPTestModule, MOCK_IMAGE } from '@campus-cloud/shared/tests';

describe('BannerUploadComponent', () => {
  configureTestSuite();
  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        imports: [CPTestModule, BannerModule, HttpClientTestingModule, RouterTestingModule]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let de: DebugElement;
  let component: BannerUploadComponent;
  let fixture: ComponentFixture<BannerUploadComponent>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BannerUploadComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;

    component.form = new FormBuilder().group({
      logo_url: MOCK_IMAGE,
      branding_color: '0076FF',
      school_name_logo_url: MOCK_IMAGE
    });

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit upload button events', () => {
    component.isEdit = false;
    fixture.detectChanges();

    const uploadSpy = spyOn(component.upload, 'emit');
    const errorSpy = spyOn(component.error, 'emit');
    const resetSpy = spyOn(component.resetClick, 'emit');
    const uploadBtn = de.query(By.css('.upload-button')).nativeElement;

    uploadBtn.dispatchEvent(new Event('upload'));
    expect(uploadSpy).toHaveBeenCalledTimes(1);

    uploadBtn.dispatchEvent(new Event('error'));
    expect(errorSpy).toHaveBeenCalledTimes(1);

    uploadBtn.dispatchEvent(new Event('reset'));
    expect(resetSpy).toHaveBeenCalledTimes(1);
  });

  it('should emit control events', () => {
    component.isEdit = true;
    fixture.detectChanges();

    const cropSpy = spyOn(component.crop, 'emit');
    const resetSpy = spyOn(component.resetClick, 'emit');
    const controlBtns = de.query(By.css('.control-buttons')).nativeElement;

    controlBtns.dispatchEvent(new Event('save'));
    expect(cropSpy).toHaveBeenCalledTimes(1);

    controlBtns.dispatchEvent(new Event('cancel'));
    expect(resetSpy).toHaveBeenCalledTimes(1);
  });
});
