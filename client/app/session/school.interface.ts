export interface ISchool {
  app_logo_url: string;
  app_url_android: string;
  app_url_ios: string;
  branding_color: string;
  email: string;
  has_multi_campus: boolean;
  id: number;
  is_verified: boolean;
  latitude: number;
  longitude: number;
  logo_url: string;
  main_union_store_id: number;
  name: string;
  premium_level: number;
  short_name: string;
  wall_unlock_num: number;
  wall_unlocked: boolean;
  client_id: number;
  is_sandbox: boolean;
  school_name_logo_url?: string;
  has_guide_customization: boolean;
}

export const LOGO_URL = 'logo_url';
export const BRANDING_COLOR = 'branding_color';
export const SCHOOL_LOGO_URL = 'school_name_logo_url';

export interface ISchoolBranding {
  [LOGO_URL]?: string;
  [BRANDING_COLOR]?: string;
  [SCHOOL_LOGO_URL]?: string;
}
