import { createAction, props } from '@ngrx/store';

export const banEmail = createAction('[manage.walls] ban email', props<{ email: string }>());
export const unBanEmail = createAction('[manage.walls] un-ban email', props<{ email: string }>());
export const setBannedEmails = createAction(
  '[manage.walls] set banned emails',
  props<{ emails: string[] }>()
);
