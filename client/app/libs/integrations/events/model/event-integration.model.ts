import { FormBuilder, Validators } from '@angular/forms';

import { FeedIntegration } from '../../common/model';

export class EventIntegration extends FeedIntegration {
  constructor() {
    super();
  }

  static form(eventIntegration?) {
    const fb = new FormBuilder();

    const _integration = {
      school_id: eventIntegration ? eventIntegration.school_id : null,
      store_id: eventIntegration ? eventIntegration.store_id : null,
      feed_url: eventIntegration ? eventIntegration.feed_url : null,
      feed_type: eventIntegration ? eventIntegration.feed_type : FeedIntegration.types.rss,
      poster_url: eventIntegration ? eventIntegration.poster_url : null,
      poster_thumb_url: eventIntegration ? eventIntegration.poster_thumb_url : null,
      sync_status: eventIntegration ? eventIntegration.sync_status : FeedIntegration.status.pending,
      last_successful_sync_epoch: eventIntegration
        ? eventIntegration.last_successful_sync_epoch
        : null
    };

    return fb.group({
      school_id: [_integration.school_id, Validators.required],
      store_id: [_integration.store_id, Validators.required],
      feed_url: [_integration.feed_url, Validators.required],
      feed_type: [_integration.feed_type, Validators.required],
      poster_url: [_integration.poster_url],
      poster_thumb_url: [_integration.poster_thumb_url],
      sync_status: [_integration.sync_status],
      last_successful_sync_epoch: [_integration.last_successful_sync_epoch]
    });
  }
}
