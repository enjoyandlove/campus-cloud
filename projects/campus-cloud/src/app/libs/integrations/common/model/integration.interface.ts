export enum IntegrationStatus {
  successful = 1,
  error = -1,
  pending = 0,
  running = 2
}

export enum IntegrationTypes {
  rss = 1,
  atom = 2,
  ical = 3
}

export enum SyncStatus {
  notSynced = -1
}

export interface IFeedIntegration {
  readonly id;
  feed_url: string;
  school_id: number;
  last_successful_sync_epoch: number;
  feed_type: IntegrationTypes;
  sync_status: IntegrationStatus;
}
