import * as fromActions from '@controlpanel/contact-trace/health-dashboard/store/actions';
import { Action, createReducer, on } from '@ngrx/store';

export interface FiltersState {
  timeRange: {
    start: number;
    end: number;
  } | null;
  audience: any;
}

const initialState: FiltersState = {
  timeRange: null,
  audience: null
};

const reducer = createReducer(
  initialState,
  on(fromActions.setDateFilter, (state, { start, end }) => {
    return {
      ...state,
      timeRange: { start, end }
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
