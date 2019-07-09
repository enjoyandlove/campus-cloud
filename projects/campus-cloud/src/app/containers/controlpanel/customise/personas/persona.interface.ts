import { PersonasType } from './personas.status';

export interface IPersona {
  id?: number;
  login_requirement: number;
  cre_enabled: boolean;
  rank: number;
  home_todays_schedule_enabled: boolean;
  home_my_courses_enabled: boolean;
  home_due_dates_enabled: boolean;
  platform: PersonasType;
  localized_name_map: {
    fr: string;
    en: string;
  };
  pretour_enabled: boolean;
}
