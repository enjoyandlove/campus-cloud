import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { ISocialPostCategory } from './feeds.interfaces';

export enum SocialPostCategoryType {
  global = 0,
  campusWall = 1,
  genericGroup = 2,
  classWall = 3
}

export class SocialPostCategoryModel {
  type: SocialPostCategoryType;

  static form(socialPostCategory?: ISocialPostCategory): FormGroup {
    const _socialPostCategory = {
      name: socialPostCategory ? socialPostCategory.name : null,
      description: socialPostCategory ? socialPostCategory.description : null,
      icon_url: socialPostCategory ? socialPostCategory.icon_url : null,
      type: socialPostCategory ? socialPostCategory.type : SocialPostCategoryType.campusWall,
      is_default: socialPostCategory ? socialPostCategory.is_default : false,
      is_postable: socialPostCategory ? socialPostCategory.is_postable : false
    };

    const fb = new FormBuilder();
    return fb.group({
      school_id: [null, Validators.required],
      name: [_socialPostCategory.name, Validators.required],
      description: [_socialPostCategory.description, [Validators.required]],
      icon_url: [_socialPostCategory.icon_url],
      type: [_socialPostCategory.type, Validators.required],
      is_default: [_socialPostCategory.is_default, Validators.required],
      is_postable: [_socialPostCategory.is_postable, Validators.required]
    });
  }
}
