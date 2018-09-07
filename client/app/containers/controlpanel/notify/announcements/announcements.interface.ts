export interface IMessage {
  is_school_wide: boolean;
  list_details: [IList];
  user_details: [IUser];
  subject: string;
  message: string;

  id: number;
  priority: number;
  sent_time: number;
  store_id: number;
  store_name: string;
}

export interface IList {
  id: number;
  name: string;
}

export interface IUser {
  id: number;
  firstname: string;
  lastname: string;
}
