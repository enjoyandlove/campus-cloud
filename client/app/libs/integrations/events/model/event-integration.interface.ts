import { IFeedIntegration } from './../../common/model/integration.interface';

export interface IEventIntegration extends IFeedIntegration {
  poster_url: string;
  feed_obj_id: number;
  poster_thumb_url: string;
}

export enum EventFeedObjectType {
  campusEvent = 1,
  academicEvent = 2
}
