import { createAction, props } from '@ngrx/store';

export const setError = createAction('[Web Form Error] Set Error', props<{ message: string }>());
