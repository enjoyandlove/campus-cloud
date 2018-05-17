export const AUDIENCE_IMPORTED = 'AUDIENCE_IMPORTED';

export interface IAudience {
  audience_id: number;
  new_audience_active: boolean;
  saved_audience_active: boolean;
}

const initialState: IAudience = {
  audience_id: null,
  new_audience_active: false,
  saved_audience_active: true
};

export function reducer(state = initialState, action): IAudience {
  switch (action.type) {
    case AUDIENCE_IMPORTED:
      return Object.assign({}, state, { ...action.payload });
    default:
      return state;
  }
}
