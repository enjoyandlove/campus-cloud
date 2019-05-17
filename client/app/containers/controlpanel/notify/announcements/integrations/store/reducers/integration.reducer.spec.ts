import * as fromActions from '../actions';
import { mockIntegration } from '../../tests/mock';
import * as fromReducer from './integration.reducer';

describe('Announcements Integrations Reducer', () => {
  let initialState: fromReducer.IAnnouncementsIntegrationState;
  beforeEach(() => {
    initialState = fromReducer.initialState;
  });

  describe('GET_INTEGRATIONS', () => {
    it('should set loading flag to true', () => {
      const action = new fromActions.GetIntegrations();
      const state = fromReducer.reducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBe(false);
    });
  });

  describe('GET_INTEGRATIONS_SUCCESS', () => {
    it('should update entities with response', () => {
      const action = new fromActions.GetIntegrationsSuccess({ integrations: [mockIntegration] });
      const state = fromReducer.reducer(initialState, action);

      expect(state.entities[mockIntegration.id]).toEqual(mockIntegration);
    });
  });

  describe('GET_INTEGRATIONS_FAIL', () => {
    it('should set error flag to true', () => {
      const action = new fromActions.GetIntegrationsFail();
      const state = fromReducer.reducer(initialState, action);

      expect(state.error).toBe(true);
    });
  });

  describe('DELETE_INTEGRATION', () => {
    it('should set loading flag to true', () => {
      const payload = {
        integration: mockIntegration
      };

      const action = new fromActions.DeleteIntegrations(payload);
      const state = fromReducer.reducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBe(false);
    });
  });

  describe('DELETE_INTEGRATION_SUCCESS', () => {
    it('should remove entity', () => {
      initialState = {
        ...initialState,
        ids: [mockIntegration.id],
        entities: { [mockIntegration.id]: mockIntegration }
      };

      const payload = {
        integrationId: mockIntegration.id
      };

      const action = new fromActions.DeleteIntegrationsSuccess(payload);
      const state = fromReducer.reducer(initialState, action);

      expect(state.ids.length).toBe(0);
    });
  });

  describe('DELETE_INTEGRATION_FAIL', () => {
    it('should set error flag to true', () => {
      const action = new fromActions.DeleteIntegrationsFail();
      const state = fromReducer.reducer(initialState, action);

      expect(state.error).toBe(true);
      expect(state.loading).toBe(false);
    });
  });

  describe('CREATE_INTEGRATION', () => {
    it('should set loading flag to true', () => {
      const body = mockIntegration;

      const action = new fromActions.CreateIntegration(body);
      const state = fromReducer.reducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBe(false);
    });
  });

  describe('CREATE_INTEGRATION_SUCCESS', () => {
    it('should add entity', () => {
      const payload = mockIntegration;

      const action = new fromActions.CreateIntegrationSuccess(payload);
      const state = fromReducer.reducer(initialState, action);

      expect(state.entities[mockIntegration.id]).toEqual(mockIntegration);
    });
  });

  describe('CREATE_INTEGRATION_FAIL', () => {
    it('should set error flag to true', () => {
      const action = new fromActions.CreateIntegrationFail();
      const state = fromReducer.reducer(initialState, action);

      expect(state.error).toBe(true);
      expect(state.loading).toBe(false);
    });
  });
});
