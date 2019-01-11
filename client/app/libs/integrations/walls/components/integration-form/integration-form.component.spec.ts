import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { CPI18nService } from '@app/shared/services';
import { CPDropdownComponent } from '@shared/components';
import { configureTestSuite } from '@client/app/shared/tests';
import { SharedModule } from '@client/app/shared/shared.module';
import { WallsIntegrationFormComponent } from './integration-form.component';
import { WallsIntegrationModel } from '../../model/walls.integrations.model';
import { CommonIntegrationUtilsService } from '@libs/integrations/common/providers';

describe('WallsIntegrationFormComponent', () => {
  configureTestSuite();

  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        providers: [CPI18nService],
        imports: [SharedModule, ReactiveFormsModule, HttpClientModule],
        declarations: [WallsIntegrationFormComponent]
      });

      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail)
  );

  let component: WallsIntegrationFormComponent;
  let fixture: ComponentFixture<WallsIntegrationFormComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WallsIntegrationFormComponent);
    component = fixture.componentInstance;

    component.form = WallsIntegrationModel.form();
    component.channels$ = of([CPDropdownComponent.defaultPlaceHolder()]);
    component.types = new CommonIntegrationUtilsService().typesDropdown();

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
});
