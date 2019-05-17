import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromStore from '../store';
import { IItem } from '@shared/components';
import { CPSession } from '@client/app/session';
import { ISocialPostCategory } from '../../model';
import { amplitudeEvents } from '@shared/constants';
import { WallsIntegrationModel } from '@libs/integrations/walls/model';
import { WallsIntegrationsService } from './../walls-integrations.service';
import { SocialPostCategoryModel } from './../../model/social-post-category.model';
import { CommonIntegrationUtilsService } from '@libs/integrations/common/providers';
import { WallsIntegrationFormComponent } from '@libs/integrations/walls/components';
import { FeedIntegration } from '@libs/integrations/common/model/integration.model';

@Component({
  selector: 'cp-walls-integrations-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class WallsIntegrationsCreateComponent implements OnInit {
  @Output() teardown: EventEmitter<null> = new EventEmitter();

  form: FormGroup;
  typesDropdown: IItem[];
  channels$: Observable<IItem[]>;
  channelType = amplitudeEvents.EXISTING;

  constructor(
    private session: CPSession,
    private service: WallsIntegrationsService,
    public store: Store<fromStore.IWallsIntegrationState>
  ) {}

  get defaultParams() {
    const schoolId = this.session.g.get('school').id;

    return new HttpParams().set('school_id', schoolId);
  }

  resetModal() {
    this.form.reset();
    this.teardown.emit();
  }

  async doSubmit() {
    if (!this.form.valid) {
      return;
    }

    let body = this.form.value;

    const params = this.defaultParams;
    const shouldCreateSocialPost =
      this.form.get('social_post_category_id').value ===
      WallsIntegrationFormComponent.shouldCreateSocialPostCategory;

    if (shouldCreateSocialPost) {
      this.channelType = amplitudeEvents.NEW;
      let newSocialPostCategory: ISocialPostCategory;
      const channelName = this.form.get('channel_name').value;
      const socialPostCategoryForm = SocialPostCategoryModel.form();
      socialPostCategoryForm.get('name').setValue(channelName);
      socialPostCategoryForm.get('description').setValue('default');
      socialPostCategoryForm.get('school_id').setValue(this.session.g.get('school').id);

      try {
        newSocialPostCategory = await this.service
          .createSocialPostCategory(socialPostCategoryForm.value, params)
          .toPromise();
      } catch (error) {
        this.store.dispatch(new fromStore.PostSocialPostCategoriesFail(error));
        this.resetModal();
        return;
      }

      this.store.dispatch(new fromStore.PostSocialPostCategoriesSuccess(newSocialPostCategory));

      body = {
        ...body,
        social_post_category_id: newSocialPostCategory.id
      };
    }

    const payload = {
      body,
      params,
      channelType: this.channelType
    };

    this.store.dispatch(new fromStore.PostIntegration(payload));
    this.resetModal();
  }

  ngOnInit() {
    const schoolId = this.session.g.get('school').id;

    this.typesDropdown = CommonIntegrationUtilsService.typesDropdown().filter(
      (t) => t.action !== FeedIntegration.types.ical
    );
    this.channels$ = this.store.select(fromStore.getSocialPostCategories);

    this.form = WallsIntegrationModel.form();
    this.form.get('school_id').setValue(schoolId);
  }
}
