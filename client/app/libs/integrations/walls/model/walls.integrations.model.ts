import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { FeedIntegration } from '../../common/model';
import { CustomValidators } from '@shared/validators';
import { IWallsIntegration } from './walls.integrations.interface';

export class WallsIntegrationModel extends FeedIntegration {
  public poster_url: number;
  public poster_thumb_url: number;
  public social_post_category_id: number;

  static form(wallFeed?: IWallsIntegration): FormGroup {
    const fb = new FormBuilder();

    const _integration = {
      school_id: wallFeed ? wallFeed.school_id : null,
      social_post_category_id: wallFeed ? wallFeed.social_post_category_id : null,
      feed_url: wallFeed ? wallFeed.feed_url : null,
      feed_type: wallFeed ? wallFeed.feed_type : FeedIntegration.types.rss,
      poster_display_name: wallFeed ? wallFeed.poster_display_name : null,
      poster_avatar_url: wallFeed ? wallFeed.poster_avatar_url : null
    };

    return fb.group({
      school_id: [_integration.school_id, Validators.required],
      social_post_category_id: [_integration.social_post_category_id, Validators.required],
      feed_url: [
        _integration.feed_url,
        Validators.compose([
          Validators.required,
          Validators.maxLength(1024),
          CustomValidators.requiredNonEmpty
        ])
      ],
      feed_type: [_integration.feed_type, Validators.required],
      poster_display_name: [
        _integration.poster_display_name,
        Validators.compose([
          Validators.required,
          Validators.maxLength(128),
          CustomValidators.requiredNonEmpty
        ])
      ],
      poster_avatar_url: [
        _integration.poster_avatar_url,
        Validators.compose([Validators.required, Validators.maxLength(128)])
      ]
    });
  }
}
