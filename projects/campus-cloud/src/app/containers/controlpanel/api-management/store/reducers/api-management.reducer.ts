import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { on, createReducer, Action } from '@ngrx/store';

import * as featureAction from '../actions';

import { IAPIManagementState, IPublicApiAccessToken } from '../../model';

export const defaultApiAccessToken: IAPIManagementState = {
  ids: [],
  error: null,
  next: false,
  entities: {},
  loading: false,
  previous: false
};

export const apiAccessTokenAdaptor: EntityAdapter<IPublicApiAccessToken> = createEntityAdapter<
  IPublicApiAccessToken
>();

export const initialState: IAPIManagementState = apiAccessTokenAdaptor.getInitialState(
  defaultApiAccessToken
);

const featureReducer = createReducer(
  initialState,
  on(
    featureAction.loadRequest,
    featureAction.postRequest,
    featureAction.deleteRequest,
    (state) => ({
      ...state,
      loading: true
    })
  ),
  on(
    featureAction.loadFailure,
    featureAction.postFailure,
    featureAction.deleteFailure,
    (state, { error }) => ({
      ...state,
      error,
      loading: false
    })
  ),
  on(featureAction.loadSuccess, (state, { data, next, previous }) =>
    apiAccessTokenAdaptor.addAll(data, {
      ...state,
      next,
      previous,
      loading: false
    })
  ),
  on(featureAction.postSuccess, (state, { data }) =>
    apiAccessTokenAdaptor.addOne(data, {
      ...state,
      loading: false
    })
  ),
  on(featureAction.deleteSuccess, (state, { deletedId }) => {
    return apiAccessTokenAdaptor.removeOne(deletedId, {
      ...state,
      loading: false
    });
  })
);

export function reducer(state: IAPIManagementState | undefined, action: Action) {
  return featureReducer(state, action);
}
