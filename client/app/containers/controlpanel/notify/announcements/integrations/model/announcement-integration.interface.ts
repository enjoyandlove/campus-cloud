import { IFeedIntegration } from '@libs/integrations/common/model';
import { AnnouncementPriority } from './../../announcements.interface';

export interface IAnnoucementsIntegration extends IFeedIntegration {
  store_id: number;
  priority: AnnouncementPriority;
}
