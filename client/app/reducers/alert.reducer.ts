export const ALERT_PUSH = 'ALERT_PUSH';
export const ALERT_DEFAULT = 'ALERT_DEFAULT';

export const ALERT_CLASS = {
  INFO: 'info',
  DANGER: 'danger',
  SUCCESS: 'success',
  WARNING: 'warning',
};

export interface IAlert {
  body: string;
  class: string;
  isShow: boolean;
}

const initialState: IAlert = {
  body: '',
  class: '',
  isShow: false,
};

export function reducer(state = initialState, action): IAlert {
  switch (action.type) {
    case ALERT_PUSH:
      return Object.assign({}, state, {
        body: action.payload.body,
        class: action.payload.class,
        isShow: true,
      });
    case ALERT_DEFAULT:
      return initialState;
    default:
      return state;
  }
}
