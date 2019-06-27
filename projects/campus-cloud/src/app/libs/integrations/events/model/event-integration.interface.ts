import { IFeedIntegration } from './../../common/model/integration.interface';

export interface IEventIntegration extends IFeedIntegration {
  feed_obj_type?: EventFeedObjectType;
  feed_obj_id: number;
}

export enum EventFeedObjectType {
  campusEvent = 1,
  academicEvent = 2
}
