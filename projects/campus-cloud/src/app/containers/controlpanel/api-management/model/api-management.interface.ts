import { HttpErrorResponse } from '@angular/common/http';
import { Dictionary, EntityState } from '@ngrx/entity';

export enum AccessType {
  read = 0,
  write = 1
}

export enum ApiType {
  user = 1,
  notification = 2
}

export interface IPublicApiAccessToken {
  id?: string;
  name: string;
  token: string;
  client_id?: number;
  date_created?: number;
  date_last_modified?: number;
  token_permission_data?: object;
}

export interface IAPIManagementState extends EntityState<IPublicApiAccessToken> {
  loading: boolean;
  next: boolean;
  previous: boolean;
  ids: Array<number>;
  error: HttpErrorResponse;
  entities: Dictionary<IPublicApiAccessToken>;
}
