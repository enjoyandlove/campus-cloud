import { AnnouncementPriority } from '../../model';
import { IFeedIntegration } from '@campus-cloud/libs/integrations/common/model';

export interface IAnnouncementsIntegration extends IFeedIntegration {
  store_id: number;
  priority: AnnouncementPriority;
}
