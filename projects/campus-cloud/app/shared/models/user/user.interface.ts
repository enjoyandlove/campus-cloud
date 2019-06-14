export enum Gender {
  male = 'M',
  female = 'F',
  other = 0
}

enum UserType {
  register_with_integrations_or_before_field = 0,
  student = 1,
  faculty = 2
}

enum Status {
  verified = 1,
  unverified = 0,
  deleted = -1
}

export interface IUser {
  readonly id: number;
  school_group_id: number;
  username: string;
  gender: Gender;
  school_id: number;
  school_persona_id: number;
  status: Status;
  user_type: UserType;
  looking_for: string;
  firstname: string;
  lastname: string;
  jid: string;
  avatar_url: string;
  profile_likes: number;
  avatar_thumb_url: string;
  relationship_status: number;
  campus_thread_points: number;
  campus_comment_points: number;
  profile_hots: number;
  profile_crushes: number;
  num_friends: number;
  user_cal_share: boolean;
  twitter_handler: string;
  instagram_handler: string;
  instagram_uid: number;
  cover_photo_url: string;
  member_type: number;
  member_position: string;
  email: string;
  last_login_epoch: number;
  has_avatar: boolean;
  specific_gender: string;
  student_identifier: string;
}
