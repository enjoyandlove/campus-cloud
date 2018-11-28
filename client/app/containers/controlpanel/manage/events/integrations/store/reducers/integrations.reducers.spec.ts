import { HttpParams, HttpErrorResponse } from '@angular/common/http';

import * as fromActions from '../actions';
import * as fromReducer from './integrations.reducers';
import { mockEventIntegration } from './../../tests/mocks';
import { mockSchool } from '../../../../../../../session/mock';
import { EventIntegration } from './../../model/integration.model';

const pagination = {
  startRange: 1,
  endRange: 2
};

const httpErrorResponse = new HttpErrorResponse({ error: 'Mock Error' });

const params = new HttpParams().set('school_id', mockSchool.id.toString());

function addEventToState(state, event) {
  return {
    ...state,
    data: [...state.data, event]
  };
}

describe('Event Integrations Reducer', () => {
  describe('GET_INTEGRATIONS', () => {
    it('should set loading flag to true', () => {
      const { initialState } = fromReducer;
      const payload = {
        ...pagination,
        params
      };
      const action = new fromActions.GetIntegrations(payload);
      const result = fromReducer.reducer(initialState, action);
      const { loading } = result;

      expect(loading).toBe(true);
    });
  });

  describe('GET_INTEGRATIONS_SUCCESS', () => {
    it('should update data key with response', () => {
      const { initialState } = fromReducer;

      const mock = new EventIntegration({ ...mockEventIntegration });

      const action = new fromActions.GetIntegrationsSuccess([mock]);
      const { data, error, loaded } = fromReducer.reducer(initialState, action);

      expect(loaded).toBe(true);
      expect(error).toBe(false);
      expect(data.length).toBe(1);
      expect(data[0].id).toBe(mock.id);
    });
  });

  describe('GET_INTEGRATIONS_FAIL', () => {
    it('should set loading flag to true', () => {
      const { initialState } = fromReducer;

      const action = new fromActions.GetIntegrationsFail(httpErrorResponse);
      const { loaded, error } = fromReducer.reducer(initialState, action);

      expect(error).toBe(true);
      expect(loaded).toBe(false);
    });
  });

  describe('POST_INTEGRATION', () => {
    it('should set completedAction flag to null', () => {
      const { initialState } = fromReducer;
      const body = mockEventIntegration;
      const payload = {
        body,
        params
      };

      const action = new fromActions.PostIntegration(payload);
      const { loading, completedAction } = fromReducer.reducer(initialState, action);

      expect(loading).toBe(true);
      expect(completedAction).toBeNull();
    });
  });

  describe('POST_INTEGRATION_SUCCESS', () => {
    it('should set completedAction flag to null', () => {
      const { initialState } = fromReducer;
      const payload = new EventIntegration({ ...mockEventIntegration });

      const action = new fromActions.PostIntegrationSuccess(payload);
      const { data, completedAction } = fromReducer.reducer(initialState, action);

      expect(data.length).toEqual(1);
      expect(data[0].id).toBe(payload.id);
      expect(completedAction).not.toBeNull();
    });
  });

  describe('POST_INTEGRATION_FAIL', () => {
    it('should set error flag to true', () => {
      const { initialState } = fromReducer;

      const action = new fromActions.PostIntegrationFail(httpErrorResponse);
      const { error } = fromReducer.reducer(initialState, action);

      expect(error).toBe(true);
    });
  });

  describe('DELETE_INTEGRATION', () => {
    it('should set completedAction flag to null', () => {
      const { initialState } = fromReducer;
      const payload = {
        params,
        integrationId: mockEventIntegration.id
      };

      const action = new fromActions.DeleteIntegration(payload);
      const { completedAction, loading } = fromReducer.reducer(initialState, action);

      expect(loading).toBe(true);
      expect(completedAction).toBeNull();
    });
  });

  describe('DELETE_INTEGRATION_SUCCESS', () => {
    it('should set completedAction flag', () => {
      let { initialState } = fromReducer;

      initialState = addEventToState(initialState, mockEventIntegration);

      const payload = {
        deletedId: mockEventIntegration.id
      };

      const action = new fromActions.DeleteIntegrationSuccess({ ...payload });
      const { data, completedAction } = fromReducer.reducer(initialState, action);

      expect(data.length).toBe(0);
      expect(completedAction).not.toBeNull();
    });
  });

  describe('DELETE_INTEGRATION_FAIL', () => {
    it('should set error flag to true', () => {
      const { initialState } = fromReducer;

      const action = new fromActions.DeleteIntegrationFail(httpErrorResponse);
      const { error, loading } = fromReducer.reducer(initialState, action);

      expect(error).toBe(true);
      expect(loading).toBe(false);
    });
  });

  describe('EDIT_INTEGRATION', () => {
    it('should set loading flag to true', () => {
      let { initialState } = fromReducer;

      initialState = addEventToState(initialState, mockEventIntegration);

      const payload = {
        params,
        body: mockEventIntegration,
        integrationId: mockEventIntegration.id
      };

      const action = new fromActions.EditIntegration(payload);
      console.log(fromReducer.reducer(initialState, action));
      const { loading, completedAction } = fromReducer.reducer(initialState, action);

      expect(loading).toBe(true);
      expect(completedAction).toBeNull();
    });
  });

  describe('EDIT_INTEGRATION_SUCCESS', () => {
    it('should update event integration', () => {
      let { initialState } = fromReducer;
      const updatedValue = 'EDITED';

      initialState = addEventToState(initialState, mockEventIntegration);

      const edited = {
        ...mockEventIntegration,
        feed_url: updatedValue
      };

      const payload = new EventIntegration({ ...edited });

      const action = new fromActions.EditIntegrationSuccess(payload);
      const { error, data, completedAction } = fromReducer.reducer(initialState, action);

      expect(error).toBe(false);
      expect(completedAction).not.toBeNull();
      expect(data[0].feed_url).toBe(updatedValue);
    });
  });

  describe('EDIT_INTEGRATION_FAIL', () => {
    it('should set error flag to true', () => {
      const { initialState } = fromReducer;

      const action = new fromActions.EditIntegrationFail(httpErrorResponse);
      const { error, loading } = fromReducer.reducer(initialState, action);

      expect(error).toBe(true);
      expect(loading).toBe(false);
    });
  });

  describe('GET_HOSTS_SUCCESS', () => {
    it('should set hosts', () => {
      const { initialState } = fromReducer;
      const payload = [{ id: 1, name: 'fake' }];
      const action = new fromActions.GetHostsSuccess(payload);
      const { error, loading, hosts } = fromReducer.reducer(initialState, action);

      expect(error).toBe(false);
      expect(loading).toBe(false);
      expect(hosts).toEqual(payload);
    });
  });
});