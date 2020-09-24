import { createAction, props } from '@ngrx/store';
import { IDateRange } from '@projects/campus-cloud/src/app/shared/components';

export const setDateFilter = createAction(
  '[contact_trace.health_dashboard] set date filter',
  props<IDateRange>()
);

export const setAudienceFilter = createAction(
  '[contact_trace.health_dashboard] set audience filter',
  props<{ audience: any }>()
);
