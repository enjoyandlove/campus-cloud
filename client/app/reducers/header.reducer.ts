import { Action } from '@ngrx/store';

export const HEADER_UPDATE = 'HEADER_UPDATE';
export const HEADER_DEFAULT = 'HEADER_DEFAULT';

export interface IHeader {
  heading: string;
  subheading?: string;
  em?: string;
  children: [
    {
      url: string;
      label: string;
    }
  ];
}

const initialState: IHeader = {
  heading: '',
  subheading: '',
  em: '',
  children: [
    {
      url: '',
      label: ''
    }
  ]
};

export function reducer(state = initialState, action: Action): IHeader {
  switch (action.type) {
    case (HEADER_UPDATE):
      return Object.assign({}, state, action.payload);
    case (HEADER_DEFAULT):
      return initialState;
    default:
      return state;
  }
};
