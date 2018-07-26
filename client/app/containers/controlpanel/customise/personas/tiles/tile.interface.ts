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
