export enum IntegrationStatus {
  successful = 1,
  error = -1,
  pending = 0
}

export enum IntegrationTypes {
  rss = 1,
  atom = 2,
  ical = 3
}

export class FeedIntegration {
  static readonly types = IntegrationTypes;
  static readonly status = IntegrationStatus;

  public readonly id;
  public store_id: number;
  public feed_url: number;
  public school_id: number;
  public last_successful_sync_epoch: number;
  public feed_type: IntegrationTypes = IntegrationTypes.rss;
  public sync_status: IntegrationStatus = IntegrationStatus.pending;
}
