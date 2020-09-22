
import { createAction, props } from '@ngrx/store';
import { ICaseStatusStat } from '../../../cases/cases.interface';

export const getCaseStatusStats = createAction('[contact_trace.health_dashboard] get case status stats');

export const getCaseStatusStatsSuccess = createAction(
  '[contact_trace.health_dashboard] get case status stats success',
  props<{ data: ICaseStatusStat[] }>()
);

export const getCaseStatusStatsFailure = createAction(
  '[contact_trace.health_dashboard] get case status stats failure',
  props<{ error: string }>()
);
