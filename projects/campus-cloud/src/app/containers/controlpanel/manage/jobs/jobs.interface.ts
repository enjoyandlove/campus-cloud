export interface IJob {
  id?: number;
  store_id: number;
  title: string;
  employer_name: string;
  employer_description: string;
  description: string;
  how_to_apply: string;
  posting_start: number;
  posting_end: number;
  contract_start: number;
  application_deadline: number;
  location: string;
  is_ug_y1: boolean;
  is_ug_y2: boolean;
  is_ug_y3: boolean;
  is_ug_y4: boolean;
  is_masters: boolean;
  is_phd: boolean;
  is_full_time: boolean;
  is_part_time: boolean;
  is_summer: boolean;
  is_internship: boolean;
  is_credited: boolean;
  is_volunteer: boolean;
  is_oncampus: boolean;
  employer_logo_url: string;
}
