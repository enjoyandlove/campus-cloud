import { createAction, props } from '@ngrx/store';

import { ICaseStatus } from '../../../cases/cases.interface';

export const getCaseStatus = createAction(
  '[contact_trace.dashboard] get case status',
);

export const getCaseStatusSuccess = createAction(
  '[contact_trace.dashboard] get case status success',
  props<{ data: ICaseStatus[] }>()
);

export const getCaseStatusFailure = createAction(
  '[contact_trace.dashboard] get case status failure',
  props<{ error: string }>()
);
