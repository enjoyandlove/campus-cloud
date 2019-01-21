import * as actions from './links.actions';
import { ILinksState } from './links.state';

export const initialState: ILinksState = {
  range: {
    start_range: 1,
    end_range: 101
  },
  search_str: null,
  sort: {
    sort_field: 'name',
    sort_direction: 'asc'
  },
  links: [],
  loaded: false,
  loading: false
};

export function reducer(state = initialState, action: actions.LinksActions): ILinksState {
  switch (action.type) {
    case actions.LinksActionTypes.SET_LINKS_RANGE: {
      const range = action.payload;

      return { ...state, range };
    }

    case actions.LinksActionTypes.SET_LINKS_SEARCH: {
      const search_str = action.payload;

      return { ...state, search_str };
    }

    case actions.LinksActionTypes.SET_LINKS_SORT: {
      const sort = action.payload;

      return { ...state, sort };
    }

    case actions.LinksActionTypes.LOAD_LINKS: {
      return { ...state, loading: true };
    }

    case actions.LinksActionTypes.LOAD_LINKS_SUCCESS: {
      const links = action.payload;

      return {
        ...state,
        links,
        loaded: true,
        loading: false
      };
    }

    case actions.LinksActionTypes.LOAD_LINKS_FAILURE: {
      return {
        ...state,
        loaded: false,
        loading: false
      };
    }

    case actions.LinksActionTypes.CREATE_LINK: {
      return state;
    }

    case actions.LinksActionTypes.CREATE_LINK_SUCCESS: {
      const links = [action.payload, ...state.links];

      return { ...state, links };
    }

    case actions.LinksActionTypes.CREATE_LINK_FAILURE: {
      return state;
    }

    case actions.LinksActionTypes.DELETE_LINK: {
      return state;
    }

    case actions.LinksActionTypes.DELETE_LINK_SUCCESS: {
      const links = state.links.filter((link) => link.id !== action.payload);

      return { ...state, links };
    }

    case actions.LinksActionTypes.DELETE_LINK_FAILURE: {
      return state;
    }

    case actions.LinksActionTypes.UPDATE_LINK: {
      return state;
    }

    case actions.LinksActionTypes.UPDATE_LINK_SUCCESS: {
      const links = state.links.map((link) => {
        if (link.id === action.payload.id) {
          return action.payload;
        }

        return link;
      });

      return { ...state, links };
    }

    case actions.LinksActionTypes.UPDATE_LINK_FAILURE: {
      return state;
    }
  }

  return state;
}
