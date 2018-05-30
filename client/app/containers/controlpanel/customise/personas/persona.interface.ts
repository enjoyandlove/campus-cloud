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

export interface ITile {
  id?: number;
  school_persona_id?: number;
  tile_category_id: number;
  name: number;
  description: string;
  rank: number;
  img_url: string;
  color: string;
  type: number;
  extra_info: any;
  featured_rank: number;
  visibility_status: number;
  related_link_data: any;
}

export interface ITileCategory {
  id?: number;
  name: string;
  rank: number;
}

export interface ICampusGuide {
  id?: number;
  name: string;
  rank: number;
  tiles?: Array<ITile>;
}
