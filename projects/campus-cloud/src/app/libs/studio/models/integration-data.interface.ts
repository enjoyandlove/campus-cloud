export interface IIntegrationData {
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
  FOLLETT = 3
}
