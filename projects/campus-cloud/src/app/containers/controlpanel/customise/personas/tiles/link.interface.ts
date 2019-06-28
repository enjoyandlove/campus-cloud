export interface ILink {
  id: number;
  name: string;
  description: string;
  school_id: number;
  link_type: number;
  link_url: string;
  link_params: any;
  img_url: string;
  open_in_browser: boolean;
  is_system: boolean;
}
