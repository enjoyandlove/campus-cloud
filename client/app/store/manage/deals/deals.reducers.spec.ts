import { reducer } from './deals.reducer';
import * as actions from './deals.actions';
import { IDealsState } from './deals.state';

const mockStores = require('../../../containers/controlpanel/manage/deals/stores/mockStores.json');

describe('Deals Reducer', () => {
  let state: IDealsState;
  beforeEach(() => {
    state = {
      stores: [],
      loaded: false,
      loading: false
    };
  });

  it('should set loading', () => {
    state = reducer(state, new actions.LoadStores());
    expect(state.loading).toBe(true);
  });

  it('should set loading failed', () => {
    state = reducer(state, new actions.LoadStoresFail([]));
    expect(state.loaded).toBe(false);
    expect(state.loading).toBe(false);
  });

  it('should set loading success', () => {
    state = reducer(state, new actions.LoadStoresSuccess(mockStores));
    expect(state.loaded).toBe(true);
    expect(state.loading).toBe(false);
    expect(state.stores).toEqual(mockStores);
  });
});
