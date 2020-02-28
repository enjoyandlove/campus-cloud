export interface IIntegrationData {
  client_int: [];
  extra_data: IExtraData[];
}

export interface IExtraData {
  school_id: number;
  extra_data_type: number;
  config_data: IConfigData;
}

export interface IConfigData {
  client_int: IClientInt[];
}

export interface IClientInt {
  request: {
    cookies: {
      'rea.auth': string;
    };
  };
}

export enum ExtraDataType {
  ENROLLMENT = 1,
  DIRECTORY = 2,
  FOLLETT = 3,
  HOLDS_WEB = 4,
  BURSAR_WEB = 5,
  FINANCIAL_AID_WEB = 6,
  ENROLLMENT_WEB = 7,
  TODO_WEB = 8,
  COURSE_CATALOG_WEB = 9,
  CLASS_SEARCH_WEB = 10,
  ASI_VOTING_WEB = 11,
  TUITION_CALCULATOR_WEB = 12,
  EXAM_SCHEDULED_WEB = 13,
  SURVEY_WEB = 14
}
