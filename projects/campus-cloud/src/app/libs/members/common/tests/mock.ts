import { IMember } from '../model';
import { Gender } from '@campus-cloud/shared/models/user';
import { MemberType } from '@campus-cloud/libs/members/common/model';

export const mockMember: IMember = {
  id: 365241,
  school_group_id: 3062,
  username: 'John-Paul du Loup',
  gender: Gender.male,
  school_id: 13190,
  school_persona_id: 1,
  status: 1,
  user_type: 0,
  looking_for: 'Bonjour-hi from Montr',
  firstname: 'John-Paul',
  lastname: 'du Loup',
  jid: '50d9d2205caae9dc75b0328d0d509ffefce1a2cc',
  avatar_url: '',
  profile_likes: 0,
  avatar_thumb_url: '',
  relationship_status: -1,
  campus_thread_points: 0,
  campus_comment_points: 0,
  profile_hots: 0,
  profile_crushes: 0,
  num_friends: 12,
  user_cal_share: false,
  twitter_handler: '',
  instagram_handler: '',
  instagram_uid: 0,
  cover_photo_url: '',
  member_type: 0,
  member_position: '',
  email: 'johnpaul@oohlalamobile.com',
  last_login_epoch: 1551301639,
  has_avatar: true,
  specific_gender: 'M',
  student_identifier: ''
};

export const filledForm = {
  group_id: 1,
  member: 1,
  member_type: MemberType.member,
  member_position: 'boss'
};
