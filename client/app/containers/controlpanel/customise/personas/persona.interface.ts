export interface IPersona {
  id?: number;
  login_requirement: number;
  cre_enabled: boolean;
  rank: number;
  platform: number;
  localized_name_map: {
    fr: string;
    en: string;
  };
  pretour_enabled: boolean;
}
