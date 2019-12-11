export interface ISocialPostCategory {
  readonly id: number;
  name: string;
  description: string;
  icon_url: string;
  type: number;
  is_default: boolean;
  is_postable: boolean;
}
export interface ISocialGroup {
  readonly id: number;
  name: string;
  image_url: string;
  group_type: number;
  member_count: number;
  memberlist_visibility_level: number;
  creator_id: number;
  related_obj_id: number;
  min_posting_member_type: number;
  min_commenting_member_type: number;
  last_message: string;
  last_message_has_image: boolean;
  last_message_user_display_name: string;
  last_message_time: number;
}

export interface SocialWallContent {
  id: number;
  obj_type: SocialWallContentObjectType;
  highlight: Highlight;
}

export interface Highlight {
  name?: string[];
  description?: string[];
}

export enum SocialWallContentObjectType {
  groupThread = 'group_thread',
  campusThread = 'campus_thread',
  groupComment = 'group_comment',
  campusComment = 'campus_comment'
}
