import { HttpParams } from '@angular/common/http';

import IServiceProvider from '../../providers.interface';
import { IFilterState } from '@controlpanel/manage/services/providers.utils.service';

export const mockFilterState: IFilterState = {
  searchText: null,
  dateRange: {
    start: 1566532799,
    end: 1564632000,
    label: 'Aug 1, 2019 - Aug 22, 2019'
  },
  studentFilter: {
    personaId: 2440,
    label: "Students' Tile",
    cohort_type: 'Experience',
    route_id: "students'_tile"
  }
};

export function serviceProviderAttendeesListSearch(
  all: string,
  provider: IServiceProvider,
  state
): HttpParams {
  return new HttpParams()
    .set('service_id', provider.campus_service_id.toString())
    .set('service_provider_id', provider.id.toString())
    .set('sort_field', state.sort_field)
    .set('sort_direction', state.sort_direction)
    .set('all', '1');
}
