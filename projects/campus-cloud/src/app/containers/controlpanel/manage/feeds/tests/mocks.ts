import { IDataExportWallsPost, IDataExportWallsComment } from '../feeds-export.utils.service';

export const mockSocialPostCategory = {
  id: 1,
  school_id: 157,
  name: 'mock social post category',
  type: 1,
  icon_url: '',
  description: '',
  is_default: false,
  is_postable: false
};

export const filledForm = {
  school_id: 157,
  name: 'mock social post category',
  type: 1,
  icon_url: 'icon',
  description: 'desc',
  is_default: false,
  is_postable: false
};

export const mockFeedGroup = {
  id: 1,
  name: 'mock name',
  related_obj_id: 1,
  min_posting_member_type: 1,
  min_commenting_member_type: 3
};

export const mockFeed = {
  image_list: [],
  post_type: 1,
  likes: 0,
  integration_feed_id: 1,
  message: 'yay2',
  id: 548942,
  user_status: 1,
  channelName: 'mock name',
  display_name: 'a a',
  comment_count: 0,
  added_time: 1525453832,
  school_id: 157,
  last_comment_time: 0,
  dislikes: 0,
  image_thumb_url: '',
  flag: 0,
  image_url: '',
  user_id: 388713,
  is_global: false,
  has_image: false,
  extern_poster_id: 0,
  image_url_list: [''],
  is_anonymous: false,
  email: 'sebastien@oohlalamobile.com',
  avatar_thumb: 'https://d3tlp0m01b6d9o.cloudfront.net/defaultavatar_2016.png'
};

export const mockDataExportWallPost: IDataExportWallsPost = {
  id: '1',
  author_name: 'John',
  author_email: 'john@gmail.com',
  student_id: '1',
  created_at: 'Fri Oct 11 2019 11:50:19 GMT-0400',
  content: 'Post Body',
  attachments: [],
  likes: 1,
  dislikes: 1,
  comment_count: 1
};

export const mockDataExportWallComment: IDataExportWallsComment = {
  thread_id: 1,
  author_name: 'john',
  author_email: 'john@gmail.com',
  student_id: '1',
  created_at: 'Fri Oct 11 2019 11:50:19 GMT-0400',
  content: 'Comment Body',
  attachments: [],
  likes: 1,
  dislikes: 1
};
