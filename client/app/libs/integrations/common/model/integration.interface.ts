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

export interface IFeedIntegration {
  readonly id;
  store_id: number;
  feed_url: string;
  school_id: number;
  last_successful_sync_epoch: number;
  feed_type: IntegrationTypes;
  sync_status: IntegrationStatus;
}
