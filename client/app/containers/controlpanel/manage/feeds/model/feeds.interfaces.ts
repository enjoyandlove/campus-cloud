export interface ISocialPostCategory {
  readonly id: number;
  name: string;
  description: string;
  icon_url: string;
  type: number;
  is_default: boolean;
  is_postable: boolean;
}
