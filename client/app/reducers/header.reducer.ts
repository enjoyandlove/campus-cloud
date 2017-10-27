import { Action } from '@ngrx/store';

export const HEADER_UPDATE = 'HEADER_UPDATE';
export const HEADER_DEFAULT = 'HEADER_DEFAULT';

export interface IHeader {
  heading: string;

  subheading?: string;

  em?: string;

  crumbs?: {
    url: string;
    label: string;
  }

  children: {url: string, label: string}[];
}

const initialState: IHeader = {
  heading: '',
  subheading: '',
  em: '',
  crumbs: {
    url: null,
    label: null
  },
  children: []
};

export function reducer(state = initialState, action: Action): IHeader {
  switch (action.type) {
    case (HEADER_UPDATE):
      let payload = action.payload;

      if (!('crumbs' in payload)) {
        payload = Object.assign(
          {},
          payload,
          {
            crumbs: {
              url: null,
              label: null
            }
          }
        )
      }
      return Object.assign({}, state, payload);
    case (HEADER_DEFAULT):
      return initialState;
    default:
      return state;
  }
};
