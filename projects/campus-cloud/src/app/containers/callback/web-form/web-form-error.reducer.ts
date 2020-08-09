import { createReducer, on } from '@ngrx/store';
import { setError } from './web-form-error.actions';

const initialState: string = null;

const _webFormErrorReducer = createReducer(
  initialState,
  on(setError, (state, payload) => payload.message)
);

export function webFormErrorReducer(state, action) {
  return _webFormErrorReducer(state, action);
}
