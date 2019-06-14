import { IFeedIntegration } from '../../common/model/integration.interface';

export interface IWallsIntegration extends IFeedIntegration {
  poster_avatar_url: string;
  poster_display_name: string;
  social_post_category_id: number;
}
