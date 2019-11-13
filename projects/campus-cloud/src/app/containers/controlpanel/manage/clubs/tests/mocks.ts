import { MOCK_IMAGE } from '@campus-cloud/shared/tests';
import { CP_PRIVILEGES_MAP } from '@campus-cloud/shared/constants';
import { ClubStatus } from '@controlpanel/manage/clubs/club.status';

export class MockClubService {}

export const mockClub = {
  city: '',
  phone: '125',
  latitude: 0,
  longitude: 0,
  name: 'name',
  room_info: 123,
  country: 'country',
  address: 'address',
  location: 'location',
  province: 'province',
  postal_code: '75400',
  has_membership: true,
  logo_url: MOCK_IMAGE,
  email: 'test@gmail.com',
  status: ClubStatus.active,
  description: 'description',
  advisor_firstname: 'advisor',
  advisor_lastname: 'last name',
  advisor_email: 'advisor email'
};

export const mockClubUser = (w = true) => {
  return {
    school_level_privileges: {
      157: {
        [CP_PRIVILEGES_MAP.clubs]: {
          r: true,
          w
        }
      }
    },
    account_level_privileges: {
      1: {
        [CP_PRIVILEGES_MAP.clubs]: {
          r: true,
          w
        }
      }
    }
  };
};
