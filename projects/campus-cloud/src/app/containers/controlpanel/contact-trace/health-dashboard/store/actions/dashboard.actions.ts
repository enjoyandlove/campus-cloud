import { createAction, props } from '@ngrx/store';

import { ICaseStatus } from '../../../cases/cases.interface';

export const getCaseStatus = createAction('[contact_trace.health_dashboard] get case status');

export const getCaseStatusSuccess = createAction(
  '[contact_trace.health_dashboard] get case status success',
  props<{ data: ICaseStatus[] }>()
);

export const getCaseStatusFailure = createAction(
  '[contact_trace.health_dashboard] get case status failure',
  props<{ error: string }>()
);

export const setDateFilter = createAction(
  '[contact_trace.health_dashboard] set date filter',
  props<{ start: number; end: number }>()
);

export const setAudienceFilter = createAction(
  '[contact_trace.health_dashboard] set audience filter',
  props<{ audience: any }>()
);
