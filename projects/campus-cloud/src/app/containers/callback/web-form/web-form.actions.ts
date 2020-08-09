import { createAction, props } from '@ngrx/store';
import { FormBlock } from './form-block.interface';

export const start = createAction(
  '[Web Form] Start',
  props<{ formResponseId: number; externalUserId: string }>()
);
export const reset = createAction('[Web Form] Reset');
export const addResponse = createAction('[Web Form] Add Response', props<FormBlock>());
export const removeResponse = createAction(
  '[Web Form] RemoveResponse',
  props<{ formBlockId: number }>()
);
