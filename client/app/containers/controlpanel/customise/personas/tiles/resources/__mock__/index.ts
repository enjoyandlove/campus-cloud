import { CampusLink } from './../../../../../manage/links/tile';
import { ILink } from '../../../../../manage/links/link.interface';

export const mockResource: ILink = {
  id: 1,
  name: 'name',
  description: 'description',
  school_id: 1,
  link_type: 1,
  link_url: CampusLink.cameraQr,
  link_params: {},
  img_url: 'image_url',
  open_in_browser: false,
  is_system: true
};
