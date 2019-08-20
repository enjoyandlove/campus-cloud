import { HttpErrorResponse } from '@angular/common/http';
import { Dictionary, EntityState } from '@ngrx/entity';

export enum AccessType {
  read = 'r',
  write = 'w'
}

export enum ApiType {
  user = 'user',
  notification = 'notification'
}

export interface IPublicApiAccessToken {
  id?: string;
  name: string;
  token: string;
  client_id?: number;
  date_created?: number;
  permission_data?: object;
  date_last_modified?: number;
}

export interface IAPIManagementState extends EntityState<IPublicApiAccessToken> {
  loading: boolean;
  loaded: boolean;
  next: boolean;
  previous: boolean;
  ids: Array<number>;
  entityLoading: boolean;
  error: HttpErrorResponse;
  entity: IPublicApiAccessToken;
  entities: Dictionary<IPublicApiAccessToken>;
}
