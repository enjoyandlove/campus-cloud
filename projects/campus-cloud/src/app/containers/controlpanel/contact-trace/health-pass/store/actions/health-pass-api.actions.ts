import { createAction, props } from '@ngrx/store';
import IHealthPass from '@controlpanel/contact-trace/health-pass/health-pass.interface';


export enum HealthPassApiActionsTypes {
  LOAD_HEALTH_PASS_SUCCESS = '[Health-Pass API] Health-Pass Loaded Success',
  LOAD_HEALTH_PASS_FAIL = '[Health-Pass API] Health-Pass Loaded Fail',
  UPDATE_HEALTH_PASS_SUCCESS = '[Health-Pass API] Health-Pass Updated Success',
  UPDATE_HEALTH_PASS_FAIL = '[Health-Pass API] Health-Pass Updated Fail'
}


export const healthPassLoadedSuccess = createAction(
  HealthPassApiActionsTypes.LOAD_HEALTH_PASS_SUCCESS,
  props<{healthPass: IHealthPass[]}> ()
);

export const healthPassLoadedFail = createAction(
  HealthPassApiActionsTypes.LOAD_HEALTH_PASS_FAIL,
  props<{error: string}> ()
);

export const healthPassUpdatedSuccess = createAction(
  HealthPassApiActionsTypes.UPDATE_HEALTH_PASS_SUCCESS,
  props<{healthPassList: IHealthPass[]}> ()
);

export const healthPassUpdatedFail = createAction(
  HealthPassApiActionsTypes.UPDATE_HEALTH_PASS_FAIL,
  props<{error: string}> ()
);


