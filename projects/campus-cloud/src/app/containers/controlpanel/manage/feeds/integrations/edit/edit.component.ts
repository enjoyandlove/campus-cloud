import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromStore from '../store';
import { IItem } from '@app//shared/components';
import { CPSession } from '@app//session';
import { WallsIntegrationModel } from '@app//libs/integrations/walls/model';
import { WallsIntegrationsService } from '../walls-integrations.service';
import { ISocialPostCategory, SocialPostCategoryModel } from '../../model';
import { IWallsIntegration } from '@app/libs/integrations/walls/model';
import { CommonIntegrationUtilsService } from '@app//libs/integrations/common/providers';
import { WallsIntegrationFormComponent } from '@app//libs/integrations/walls/components';
import { FeedIntegration } from '@app//libs/integrations/common/model/integration.model';

@Component({
  selector: 'cp-walls-integrations-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class WallsIntegrationsEditComponent implements OnInit {
  @Input() integration: IWallsIntegration;

  @Output() teardown: EventEmitter<null> = new EventEmitter();

  form: FormGroup;
  selectedType: IItem;
  typesDropdown: IItem[];
  selectedChannel: IItem;
  channels$: Observable<IItem[]>;
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

    let body = this.form.getRawValue();
    const params = this.defaultParams;
    const socialPostCategoryId = this.form.get('social_post_category_id').value;
    const shouldCreateSocialPost =
      socialPostCategoryId === WallsIntegrationFormComponent.shouldCreateSocialPostCategory;

    if (shouldCreateSocialPost) {
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
      integrationId: this.integration.id
    };

    this.store.dispatch(new fromStore.EditIntegration(payload));
    this.resetModal();
  }

  ngOnInit() {
    const schoolId = this.session.g.get('school').id;
    this.typesDropdown = CommonIntegrationUtilsService.typesDropdown().filter(
      (t) => t.action !== FeedIntegration.types.ical
    );

    this.channels$ = this.store.select(fromStore.getSocialPostCategories).pipe(
      tap((channels: IItem[]) => {
        Promise.resolve(null).then(() => {
          this.selectedChannel = channels.find(
            (c) => c.action === this.form.get('social_post_category_id').value
          );
        });
      })
    );

    this.form = WallsIntegrationModel.form(this.integration);
    this.form.get('school_id').setValue(schoolId);

    this.form.get('feed_url').disable();
    this.form.get('feed_type').disable();
    this.form.get('social_post_category_id').disable();

    this.selectedType = this.typesDropdown.find(
      (t) => t.action === this.form.get('feed_type').value
    );
  }
}
