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
}
