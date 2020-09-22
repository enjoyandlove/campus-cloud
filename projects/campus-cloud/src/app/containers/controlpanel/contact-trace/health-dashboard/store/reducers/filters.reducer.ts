import * as fromActions from '@controlpanel/contact-trace/health-dashboard/store/actions';
import { Action, createReducer, on } from '@ngrx/store';
import { IDateRange } from '@projects/campus-cloud/src/app/shared/components';

export interface FiltersState {
  dateRange: IDateRange | null;
  audience: {
    label: string;
    listId: string;
  };
}

const initialState: FiltersState = {
  dateRange: null,
  audience: null
};

const reducer = createReducer(
  initialState,
  on(fromActions.setDateFilter, (state, dateRange) => {
    return {
      ...state,
      dateRange: dateRange
    };
  }),
  on(fromActions.setAudienceFilter, (state, { audience }) => {
    return {
      ...state,
      audience
    };
  })
);

export function filtersReducer(state: FiltersState | undefined, action: Action) {
  return reducer(state, action);
}
