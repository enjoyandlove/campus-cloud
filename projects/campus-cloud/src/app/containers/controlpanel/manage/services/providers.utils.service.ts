import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { get as _get } from 'lodash';

import { CPSession } from '@campus-cloud/session';
import { IDateRange } from '@campus-cloud/shared/components';
import { IStudentFilter } from '../../assess/engagement/engagement.utils.service';

export interface IFilterState {
  searchText: string;
  dateRange: IDateRange;
  studentFilter: IStudentFilter;
}

@Injectable()
export class ProvidersUtilsService {
  constructor(private session: CPSession) {}

  addSearchParams(search: HttpParams, state: IFilterState): HttpParams {
    if (!state) {
      return search;
    }
    search = this.session.addSchoolId(search);
    if (state.searchText) {
      search = search.append('search_text', state.searchText);
    }
    if (state.studentFilter) {
      const listId = _get(state, ['studentFilter', 'listId']);
      const personaId = _get(state, ['studentFilter', 'personaId']);
      if (listId) {
        search = search.append('user_list_id', listId.toString());
      } else if (personaId) {
        search = search.append('persona_id', personaId.toString());
      }
    }
    if (state.dateRange && state.dateRange.start && state.dateRange.end) {
      search = search
        .append('start', state.dateRange.start.toString())
        .append('end', state.dateRange.end.toString());
    }
    return search;
  }
}
