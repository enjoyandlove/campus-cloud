import { IntegrationTypes } from './integration.interface';

export enum IntegrationResourceTypes {
  event = 1,
  calendar = 2,
  wall = 3
}

export interface IPreviewRequest {
  school_id: number;
  external_feed_url: string;
  external_feed_type: IntegrationTypes;
  external_feed_resource_type: IntegrationResourceTypes;
}
