import { ITile } from '../../tile.interface';
import { MOCK_IMAGE } from '@campus-cloud/shared/tests';
import { CampusLink } from '@controlpanel/customise/personas/tiles/tile';
import { mockSchool } from '@projects/campus-cloud/src/app/session/mock';

export const mockLinkData = {
  link_type: 0,
  open_in_browser: 0,
  link_url: CampusLink.subscribableCalendar
};

export const mockTile: ITile = {
  id: 1,
  name: 'Mock Tile',
  school_persona_id: 1,
  tile_category_id: 1,
  description: '',
  rank: 1,
  featured_rank: -1,
  color: mockSchool.branding_color,
  img_url: MOCK_IMAGE,
  type: 8,
  extra_info: {},
  visibility_status: 1,
  related_link_data: {}
};

export const mockSecurityTile = {
  related_link_data: {
    link_params: {
      id: 12068
    },
    description: '',
    can_fav: false,
    open_in_browser: false,
    link_url: 'oohlala://campus_security_service',
    is_system: true,
    school_id: 157,
    img_url: '',
    id: 10293,
    link_type: 3,
    name: '404 debugging issue service'
  },
  name: '404 debugging issue service',
  color: 'FFFFFF',
  type: 7,
  rank: -1,
  visibility_status: 1,
  tile_category_id: 0,
  extra_info: {
    id: 10293
  },
  img_url: '',
  id: 18038,
  featured_rank: 0,
  description: ''
};
