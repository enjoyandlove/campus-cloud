import { HttpErrorResponse } from '@angular/common/http';

export interface IPublicApiAccessToken {
  id?: number;
  name: string;
  key_id?: string;
  api_key?: string;
  created: number;
  user_info: boolean;
  push_notification: boolean;
}

export interface IAPIManagementState {
  loading: boolean;
  next: boolean;
  previous: boolean;
  error: HttpErrorResponse;
  data: IPublicApiAccessToken[];
}
