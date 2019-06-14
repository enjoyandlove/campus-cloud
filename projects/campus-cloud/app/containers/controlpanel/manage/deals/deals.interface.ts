export interface IDeal {
  id?: number;

  store_id: number;

  title: string;

  image_url: string;

  image_thumb_url: string;

  description: string;

  start: number;

  expiration: number;
}
