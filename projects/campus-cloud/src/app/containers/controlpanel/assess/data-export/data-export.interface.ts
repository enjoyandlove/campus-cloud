export interface IDataExport {
  name: string;
  type: DataExportType;
}

export enum DataExportType {
  appUsers = 'appUsers'
}

export const dataExportAmplitudeMap = {
  [DataExportType.appUsers]: 'Campus App User List'
};

export interface IDataExportAppUsers {
  email: string;
  status: number;
  firstname: string;
  lastname: string;
  student_id: string;
  last_login: number;
  date_joined: number;
}
