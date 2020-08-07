import { HttpParams } from '@angular/common/http';
import { of } from 'rxjs';

import { IDateRange } from '@campus-cloud/shared/components';
import IServiceProvider from '../../../manage/services/providers.interface';
import { IFilterState } from '../../../manage/services/providers.utils.service';

export const mockProvider: IServiceProvider = {
  avg_rating_percent: 83,
  campus_service_id: 4869,
  checkin_verification_methods: [1, 2, 3],
  contactphone: '',
  custom_basic_feedback_label: 'Were you able to check-in and out? Hope those burgers were good!',
  email: 'test@gotoohlala.com',
  encrypted_campus_service_id: 'WEgSG6jznW3RxLvv4Mb9IA',
  encrypted_id: 'T3TSXclbUEmXMKxBpDsrbg',
  has_checkout: true,
  has_feedback: true,
  id: 4869,
  qr_img_url: '',
  img_url: '',
  num_ratings: 31,
  provider_name: 'Service provider with check-in and check-out',
  provider_type: 1,
  total_visits: 32,
  unique_visits: 8
};

export const mockFilter: IFilterState = {
  dateRange: { start: 1500000000, end: 1600000000, label: null },
  searchText: 'search',
  studentFilter: {
    route_id: 'test_persona',
    label: 'test persona',
    listId: 12345,
    cohort_type: 'Experience'
  }
};

export const mockDateRange: IDateRange = {
  label: 'label',
  start: 1,
  end: 2
};

export class MockProvidersService {
  getProviderByProviderId(serviceId, search: HttpParams) {
    return of({ serviceId, search });
  }
}
