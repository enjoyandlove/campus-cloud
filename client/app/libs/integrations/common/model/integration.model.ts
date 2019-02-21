import { CPDate } from '@shared/utils/date/date';
import { IntegrationTypes, IntegrationStatus } from './integration.interface';

export class FeedIntegration {
  static readonly types = IntegrationTypes;
  static readonly status = IntegrationStatus;

  public readonly id;
  public feed_url: string;
  public school_id: number;
  public last_successful_sync_epoch: number;
  public feed_type: IntegrationTypes = IntegrationTypes.rss;
  public sync_status: IntegrationStatus = IntegrationStatus.pending;

  static isNotRunning(feed: FeedIntegration) {
    return feed.sync_status !== IntegrationStatus.running;
  }

  static isLastSyncAfterThreshold(feed: FeedIntegration, tz: string) {
    const nowMoment = CPDate.now(tz);
    const lastSyncedMoment = CPDate.fromEpoch(feed.last_successful_sync_epoch, tz);

    return nowMoment.unix() > lastSyncedMoment.add(1, 'minute').unix();
  }
}
