import { IAudience } from '../base.state';

export const AUDIENCE_IMPORTED = 'AUDIENCE_IMPORTED';
export const AUDIENCE_RESET_IMPORT_AUDIENCE = 'AUDIENCE_RESET_IMPORT_AUDIENCE';

const initialState: IAudience = {
  audience_id: null,
  new_audience_active: false,
  saved_audience_active: true
};

export function reducer(state = initialState, action): IAudience {
  switch (action.type) {
    case AUDIENCE_IMPORTED:
      return { ...state, ...action.payload };
    case AUDIENCE_RESET_IMPORT_AUDIENCE:
      return { ...state, audience_id: null };
    default:
      return state;
  }
}
