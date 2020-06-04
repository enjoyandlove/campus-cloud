export enum SocialGroupTypes {
  store = 6,
  calendar = 7
}

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

export interface ICampusThread {
  id?: number;
  school_id: number;
  added_time: number;
  user_id: number;
  display_name: string;
  message: string;
  has_image: boolean;
  image_url: string;
  image_url_list: string[];
  comment_count: number;
  is_anonymous: boolean;
  likes: number;
  dislikes: number;
  post_type: number;
  last_comment_time: number;
  is_global: boolean;
  image_list: any[];
  image_thumb_url: string;
  avatar_thumb: string;
  extern_poster_id: number;
  integration_feed_id: number;
  flag: number;
  email: string;
  user_status: number;
}

export interface ICampusThreadComment {
  id?: number;
  campus_thread_id: number;
  added_time: number;
  user_id: number;
  display_name: string;
  comment: string;
  has_image: boolean;
  image_url: string;
  image_url_list: string[];
  is_anonymous: boolean;
  likes: number;
  dislikes: number;
  post_type: number;
  image_list: any[];
  image_thumb_url: string;
  avatar_thumb: string;
  extern_poster_id: number;
  flag: number;
  email: string;
  user_status: number;
}

export interface ISocialGroupThread {
  group_id: number;
  school_id: number;
  added_time: number;
  user_id: number;
  display_name: string;
  subject: string;
  message: string;
  message_html: string;
  has_image: boolean;
  image_url: string;
  image_url_list: string[];
  comment_count: number;
  is_anonymous: boolean;
  likes: number;
  dislikes: number;
  post_type: number;
  last_comment_time: number;
  id?: number;
  flag: number;
  extern_poster_id: number;
  user_status: number;
  avatar_thumb: string;
  image_thumb_url: string;
  image_list: any[];
}

export interface ISocialGroupThreadComment {
  group_thread_id: number;
  added_time: number;
  user_id: number;
  display_name: string;
  subject: string;
  comment: string;
  comment_html: string;
  has_image: boolean;
  image_url: string;
  image_url_list: string[];
  sub_comment_count: number;
  is_anonymous: boolean;
  likes: number;
  dislikes: number;
  post_type: number;
  id?: number;
  group_id: number;
  flag: number;
  extern_poster_id: number;
  user_status: number;
  avatar_thumb: string;
  image_thumb_url: string;
  image_list: any[];
}

export interface IDataExportWallsComment {
  thread_id: number;
  author_name: string;
  author_email: string;
  student_id: string;
  created_at: string;
  content: string;
  attachments: string[];
  likes: number;
  dislikes: number;
  channel_name: string;
  thread_content: string;
}

export interface IDataExportWallsPost {
  id: string;
  author_name: string;
  author_email: string;
  student_id: string;
  created_at: string;
  content: string;
  attachments: string[];
  likes: number;
  dislikes: number;
  comment_count: number;
  channel_name: string;
}

export interface IDataExportGroupThread {
  id: string;
  author_name: string;
  author_email: string;
  student_id: string;
  created_at: string;
  content: string;
  attachments: string[];
  likes: number;
  dislikes: number;
  comment_count: number;
  channel_name: string;
}

export interface IDataExportGroupThreadComment {
  thread_id: number;
  author_name: string;
  author_email: string;
  student_id: string;
  created_at: string;
  content: string;
  attachments: string[];
  likes: number;
  dislikes: number;
  channel_name: string;
  thread_content: string;
}
