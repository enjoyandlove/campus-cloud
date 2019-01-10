import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromStore from '../store';
import { IItem } from '@shared/components';
import { CPSession } from '@client/app/session';
import { WallsIntegrationModel } from '@libs/integrations/walls/model';
import { WallsIntegrationsService } from '../walls-integrations.service';
import { ISocialPostCategory, SocialPostCategoryModel } from './../../model';
import { IWallsIntegration } from '@client/app/libs/integrations/walls/model';
import { CommonIntegrationUtilsService } from '@libs/integrations/common/providers';
import { WallsIntegrationFormComponent } from '@libs/integrations/walls/components';

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
    private utils: CommonIntegrationUtilsService,
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
    this.typesDropdown = this.utils.typesDropdown();

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

    this.selectedType = this.typesDropdown.find(
      (t) => t.action === this.form.get('feed_type').value
    );
  }
}
