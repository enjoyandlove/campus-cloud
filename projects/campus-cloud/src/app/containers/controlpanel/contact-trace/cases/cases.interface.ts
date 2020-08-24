export interface ICase {
  id: number;
  current_status_id: number;
  current_action: ICaseAction;
  notes: string;
  date_last_modified: number;
  user_id: number;
  extern_user_id: string;
  firstname: string;
  lastname: string;
}

export interface ICaseStatus {
  id: number;
  name: string;
  color: string;
  case_count: number;
}

export interface ICaseAction {
  id: number;
  case_status_id: number;
  rank: number;
  name: string;
}

export enum CaseTypes {
  CtCase = 1
}

export enum ExternalUserIdTypes {
  Email = 1,
  ExternalIdentifier
}

export enum CreationMethod {
  ByAdmin = 1,
  ByCsv,
  ByForm,
  ByApi
}
