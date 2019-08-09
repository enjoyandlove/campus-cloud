import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { DebugElement } from '@angular/core';

import { CPDropdownComponent } from '@campus-cloud/shared/components';
import { getElementByCPTargetValue } from '@campus-cloud/shared/utils/tests';
import { WallsIntegrationFormComponent } from './integration-form.component';
import { WallsIntegrationModel } from '../../model/walls.integrations.model';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';
import { CommonIntegrationUtilsService } from '@campus-cloud/libs/integrations/common/providers';
import { IntegrationRequiredFieldsComponent } from '@campus-cloud/libs/integrations/common/components';

describe('WallsIntegrationFormComponent', () => {
  configureTestSuite();

  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        imports: [CPTestModule, ReactiveFormsModule, HttpClientModule],
        declarations: [WallsIntegrationFormComponent, IntegrationRequiredFieldsComponent]
      });

      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail)
  );

  let de: DebugElement;
  let component: WallsIntegrationFormComponent;
  let fixture: ComponentFixture<WallsIntegrationFormComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WallsIntegrationFormComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;

    component.form = WallsIntegrationModel.form();
    component.channels = [CPDropdownComponent.defaultPlaceHolder()];
    component.types = CommonIntegrationUtilsService.typesDropdown();

    fixture.detectChanges();
  });

  it('should init', () => {
    expect(component).toBeTruthy();
  });

  it('should create/remove channel_name control', () => {
    const channelControl = () => component.form.get('channel_name');

    expect(channelControl()).toBeNull();

    component.checkChannelNameControl(true);
    fixture.detectChanges();

    expect(channelControl()).toBeDefined();

    component.checkChannelNameControl(false);
    fixture.detectChanges();

    expect(channelControl()).toBeNull();
  });

  it('shoud set right category id when channel dropdown is used', () => {
    const socialPostCategoryValue = () => component.form.get('social_post_category_id').value;

    component.onSelectedChannel({ action: 'new_channel', label: 'new channel' });

    fixture.detectChanges();

    expect(socialPostCategoryValue()).toEqual(
      WallsIntegrationFormComponent.shouldCreateSocialPostCategory
    );

    component.onSelectedChannel({ action: 1, label: 'actual channel' });

    fixture.detectChanges();

    expect(socialPostCategoryValue()).toEqual(1);
  });

  it('should set disable attribute to fields if control is disabled', () => {
    const controlsToDisable = ['feed_type', 'feed_url', 'social_post_category_id'];
    controlsToDisable.forEach((ctrlName) => component.form.get(ctrlName).disable());

    fixture.detectChanges();

    let urlField: HTMLInputElement;
    let typeDropdown: CPDropdownComponent;
    let channelDropdown: CPDropdownComponent;

    urlField = getElementByCPTargetValue(de, 'url').nativeElement;
    typeDropdown = getElementByCPTargetValue(de, 'type').componentInstance;
    channelDropdown = getElementByCPTargetValue(de, 'channel').componentInstance;

    expect(urlField.disabled).toBe(true);
    expect(typeDropdown.disabled).toBe(true);
    expect(channelDropdown.disabled).toBe(true);
  });
});
