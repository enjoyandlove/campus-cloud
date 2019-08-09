import { on, createReducer, Action } from '@ngrx/store';

import * as featureAction from '../actions';

import { IAPIManagementState } from '../../api-management.interface';

const initialState: IAPIManagementState = {
  data: [],
  error: null,
  next: false,
  loading: false,
  previous: false
};

const featureReducer = createReducer(
  initialState,
  on(featureAction.loadRequest, (state) => ({ ...state, loading: true })),
  on(featureAction.loadFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(featureAction.loadSuccess, (state, { data, next, previous }) => ({
    ...state,
    data,
    next,
    previous,
    loading: false
  }))
);

export function reducer(state: IAPIManagementState | undefined, action: Action) {
  return featureReducer(state, action);
}
