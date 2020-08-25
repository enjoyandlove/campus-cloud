import { createSelector } from '@ngrx/store';
import { HealthPassGlobalState } from '@controlpanel/contact-trace/health-pass/store/reducers';
import * as fromHealthPass from '@controlpanel/contact-trace/health-pass/store/reducers/health-pass.reducer';


export interface State {
  healthPassSettings: HealthPassGlobalState;
}

export const selectHealthPassState = (state: State) => {
  return state.healthPassSettings.healthPass;
};

export const selectAllHealthPass = createSelector(
  selectHealthPassState,
  fromHealthPass.selectAll
);

export const selectDisplaySuccessMessage = createSelector(
  selectHealthPassState,
  fromHealthPass.displaySuccessMessage
);

export const selectDisplayErrorMessage = createSelector(
  selectHealthPassState,
  fromHealthPass.displayErrorMessage
);
