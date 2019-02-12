import { FormBuilder, Validators } from '@angular/forms';

import { CPDate } from '@shared/utils/date';
import { FeedIntegration, IntegrationStatus } from '../../common/model';
import { EventFeedObjectType, IEventIntegration } from './event-integration.interface';

export class EventIntegration extends FeedIntegration {
  static readonly objectType = EventFeedObjectType;

  public poster_url: number;
  public feed_obj_id: number;
  public poster_thumb_url: number;

  static isNotRunning(feed: IEventIntegration) {
    return feed.sync_status !== IntegrationStatus.running;
  }

  static isLastSyncAfterThreshold(feed: IEventIntegration, tz: string) {
    const nowMoment = CPDate.now(tz);
    const lastSyncedMoment = CPDate.fromEpoch(feed.last_successful_sync_epoch, tz);

    return nowMoment.unix() > lastSyncedMoment.add(1, 'minute').unix();
  }

  static form(eventIntegration?: IEventIntegration) {
    const fb = new FormBuilder();

    const _integration = {
      school_id: eventIntegration ? eventIntegration.school_id : null,
      feed_obj_id: eventIntegration ? eventIntegration.feed_obj_id : null,
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
      feed_obj_id: [_integration.feed_obj_id, Validators.required],
      feed_url: [_integration.feed_url, Validators.required],
      feed_type: [_integration.feed_type, Validators.required],
      poster_url: [_integration.poster_url],
      poster_thumb_url: [_integration.poster_thumb_url],
      sync_status: [_integration.sync_status],
      last_successful_sync_epoch: [_integration.last_successful_sync_epoch]
    });
  }
}
