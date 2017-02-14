import { Action } from '@ngrx/store';

export const PROFILE_REDUCER = {
  'UPDATE': 'UPDATE',
};

export interface IProfile {
  address: string;
  category_id: number;
  city: string;
  country: string;
  description: string;
  dislikes: number;
  email: string;
  franchise_id: number;
  has_hours: boolean;
  id: number;
  item_preview: string;
  latitude: number;
  likes: number;
  location: string;
  logo_url: string;
  longitude: number;
  name: string;
  phone: number;
  postal_code: string;
  province: string;
  room_info: string;
  secondary_name: string;
  total_item_count: number;
  website: string;
  privileges_list: any[];
}

const initialState = {
  address: '',
  category_id: 0,
  city: '',
  country: '',
  description: '',
  dislikes: 0,
  email: '',
  franchise_id: 0,
  has_hours: false,
  id: 0,
  item_preview: '',
  latitude: 0,
  likes: 0,
  location: '',
  logo_url: '',
  longitude: 0,
  name: '',
  phone: 0,
  postal_code: '',
  province: '',
  room_info: '',
  secondary_name: '',
  total_item_count: 0,
  website: '',
  privileges_list: []
};

export function reducer(state: IProfile = initialState, action: Action) {
  switch (action.type) {
    case PROFILE_REDUCER.UPDATE:
      console.log(action);
      return Object.assign({}, state, { action: action.payload });

    default:
      return state;
  }
}
