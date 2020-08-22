import IHealthPass from '@controlpanel/contact-trace/health-pass/health-pass.interface';
import { Action, createReducer, on } from '@ngrx/store';
import { HealthPassApiActions, HealthPassPageActions } from '@controlpanel/contact-trace/health-pass/store/actions';


export interface HealthPassState {
  healthPassList: IHealthPass[];
  onEditHealthPassId: string | null;
  displaySuccessMessage: boolean;
  displayErrorMessage: boolean;
}


export const healthPassInitialState: HealthPassState = {
  healthPassList: [],
  onEditHealthPassId: null,
  displaySuccessMessage: false,
  displayErrorMessage: false
};

export const healthPassReducer = createReducer(
  healthPassInitialState,
  on(HealthPassPageActions.enter, (state) => {
    return {
      ...state,
      onEditHealthPassId: null
    };
  }),
  on(HealthPassPageActions.edit, (state, action) => {
    return state;
  }),
  on(HealthPassApiActions.healthPassLoadedSuccess, (state, action) => {
    return {
      ...state,
      healthPassList: action.healthPass
    };
  }),
  on(HealthPassApiActions.healthPassUpdatedSuccess, (state, action) => {
    return {
      ...state,
      healthPassList: action.healthPassList,
      displaySuccessMessage: true
    };
  }),
  on(HealthPassApiActions.healthPassUpdatedFail, (state, action) => {
    return {
      ...state,
      displayErrorMessage: true
    };
  }),
  on(HealthPassPageActions.initSuccessMessage, (state) => {
    return {
      ...state,
      displaySuccessMessage: false
    };
  }),
  on(HealthPassPageActions.initErrorMessage, (state) => {
    return {
      ...state,
      displayErrorMessage: false
    };
  })
);



export function reducer(state: HealthPassState, action: Action) {
  return healthPassReducer(state, action);
}

export const selectAll = (state: HealthPassState) => state.healthPassList;
export const displaySuccessMessage = (state: HealthPassState) => state.displaySuccessMessage;
export const displayErrorMessage = (state: HealthPassState) => state.displayErrorMessage;
