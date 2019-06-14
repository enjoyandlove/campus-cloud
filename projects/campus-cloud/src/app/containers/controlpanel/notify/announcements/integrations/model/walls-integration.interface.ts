import { IFeedIntegration } from '@campus-cloud/libs/integrations/common/model';

export interface IAnnoucementsIntegration extends IFeedIntegration {
  poster_url: string;
  feed_obj_id: number;
  poster_thumb_url: string;
}
