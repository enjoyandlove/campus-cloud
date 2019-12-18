import { of } from 'rxjs';

import { IService } from '../service.interface';
import { MOCK_IMAGE } from '@campus-cloud/shared/tests';

export const filledForm = {
  category: 1,
  logo_url: MOCK_IMAGE,
  address: 'mock address',
  name: 'mock service name'
};

export const mockLocation = {
  city: 'Montreal',
  province: '',
  country: 'Canada',
  name: 'Milton Pizza',
  postal_code: 'H3A 2A8',
  fromUsersLocations: true,
  latitude: 45.5068431590247,
  longitude: -73.5762119293213,
  address: '635-659 Milton St, Montreal, QC H3A 2A8, Canada'
};

export const mockService: IService = {
  address: 'mock address',
  avg_rating_percent: -1,
  campus_service_id: 11997,
  category: 0,
  city: '',
  has_membership: false,
  contactphone: 27,
  country: '',
  default_basic_feedback_label: '',
  description: 'This Service has Assessment ON and Feedback OFF. ↵It also has a location.',
  email: 'johnpaul+103@oohlalamobile.com',
  external_id: '',
  extra_data_id: 396,
  id: 11997,
  is_featured: false,
  latitude: 0,
  location: '',
  logo_url:
    'https://s3.amazonaws.com/campus-cloud-image-use/5ebtlyy0qkcgyhxktwsp041mo390mnnmr12az992p3srnm970m.jpg',
  longitude: 0,
  name: '##100 - Service Assessment ON, Feedback OFF Edit',
  num_ratings: 0,
  postal_code: '',
  province: '',
  rating_scale_maximum: -1,
  room_data: '',
  school_campus_id: 0,
  school_id: 157,
  secondary_name: '##100 - Service Assessment ON, Feedback OFF Edit',
  service_attendance: 1,
  store_id: 43777,
  total_visits: 17,
  unique_visits: 12,
  website: 'www.google.com'
};

export class MockServicesService {
  dummy: any;

  getServiceById(serviceId, start, end) {
    return of({ serviceId, start, end });
  }

  getServiceAttendanceSummary(serviceId, search) {
    return of({ serviceId, search });
  }

  deleteService(serviceId: any) {
    this.dummy = [serviceId];

    return of({});
  }
}
