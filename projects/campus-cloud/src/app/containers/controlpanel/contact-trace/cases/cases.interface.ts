export interface ICase {
  id: number;
  current_status_id: number;
  current_status: ICaseStatus;
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

export interface ICaseLog {
  id: number;
  source_obj_id: number;
  source_type: number;
  source_activity_name: string;
  activity_time_epoch: number;
  new_status: ICaseStatus;
  source_case_action_id: number;
  new_notes: string;
  form_name: string;
  admin_name: string;
  source: string;
  event: string;
  contact_trace_event_id: number;
}

export interface ISourceActivityName {
  tag: string;
  name: string;
  source: string;
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

export enum SourceActivityType {
  Creation = 0,
  ManualNotes,
  ManualStatus,
  ActionNotify,
  ActionContactTrace,
  ExposureAlerts
}
