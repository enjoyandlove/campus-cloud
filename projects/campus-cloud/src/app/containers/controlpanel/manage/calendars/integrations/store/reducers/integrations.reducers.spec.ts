import { HttpParams, HttpErrorResponse } from '@angular/common/http';

import * as fromActions from '../actions';
import { mockSchool } from '@campus-cloud/session/mock';
import { mockIntegration } from '../../tests/mocks';
import * as fromReducer from './integrations.reducers';

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

describe('Calendar Items Integrations Reducer', () => {
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

  describe('SYNC_NOW_SUCCESS', () => {
    it('should toggle competedAction message if one is passed', () => {
      const { initialState } = fromReducer;
      const expectedMessage = 'hello';

      let action;
      let result;
      let expected;

      action = new fromActions.SyncNowSuccess({
        integration: mockIntegration
      });

      result = fromReducer.reducer(initialState, action);
      expected = 't_shared_saved_update_success_message';

      expect(result.completedAction).toBe(expected);

      action = new fromActions.SyncNowSuccess({
        integration: mockIntegration,
        message: expectedMessage
      });

      result = fromReducer.reducer(initialState, action);

      expect(result.completedAction).toBe(expectedMessage);
    });
  });

  describe('SYNC_NOW_FAIL', () => {
    it('should toggle error if passed', () => {
      const { initialState } = fromReducer;

      let action;
      let result;

      action = new fromActions.SyncNowFail({
        integration: mockIntegration,
        error: null
      });

      result = fromReducer.reducer(initialState, action);

      expect(result.error).toBeNull();

      action = new fromActions.SyncNowFail({
        integration: mockIntegration,
        error: 'some_error'
      });

      result = fromReducer.reducer(initialState, action);

      expect(result.error).not.toBeNull();
    });

    it('should update completedAction', () => {
      const { initialState } = fromReducer;

      let action;
      let result;

      action = new fromActions.SyncNowFail({
        integration: mockIntegration,
        error: null
      });

      result = fromReducer.reducer(initialState, action);
      expect(result.completedAction).not.toBeNull();

      action = new fromActions.SyncNowFail({
        integration: mockIntegration,
        error: 'some_error'
      });

      result = fromReducer.reducer(initialState, action);

      expect(result.completedAction).toBeNull();
    });
  });

  describe('GET_INTEGRATIONS_SUCCESS', () => {
    it('should update data key with response', () => {
      const { initialState } = fromReducer;

      const mock = mockIntegration;

      const action = new fromActions.GetIntegrationsSuccess([mock]);
      const { data, error } = fromReducer.reducer(initialState, action);

      expect(error).toBeNull();
      expect(data.length).toBe(1);
      expect(data[0].id).toBe(mock.id);
    });
  });

  describe('GET_INTEGRATIONS_FAIL', () => {
    it('should set loading flag to true', () => {
      const { initialState } = fromReducer;

      const action = new fromActions.GetIntegrationsFail(httpErrorResponse);
      const { error } = fromReducer.reducer(initialState, action);

      expect(error).not.toBeNull();
    });
  });

  describe('POST_INTEGRATION', () => {
    it('should set completedAction flag to null', () => {
      const { initialState } = fromReducer;
      const body = mockIntegration;
      const payload = {
        body,
        params,
        calendarId: mockIntegration.feed_obj_id
      };

      const action = new fromActions.PostIntegration(payload);
      const { loading, completedAction } = fromReducer.reducer(initialState, action);

      expect(loading).toBe(true);
      expect(completedAction).toBeNull();
    });
  });

  describe('POST_INTEGRATION_SUCCESS', () => {
    it('should add created integration to state', () => {
      const { initialState } = fromReducer;
      const payload = {
        integration: mockIntegration,
        calendarId: mockIntegration.feed_obj_id
      };

      const action = new fromActions.PostIntegrationSuccess(payload);
      const { data } = fromReducer.reducer(initialState, action);

      expect(data.length).toEqual(1);
      expect(data[0].id).toBe(mockIntegration.id);
    });
  });

  describe('POST_INTEGRATION_FAIL', () => {
    it('should set error flag to true', () => {
      const { initialState } = fromReducer;

      const action = new fromActions.PostIntegrationFail(httpErrorResponse);
      const { error } = fromReducer.reducer(initialState, action);

      expect(error).not.toBeNull();
    });
  });

  describe('DELETE_INTEGRATION', () => {
    it('should set completedAction flag to null', () => {
      const { initialState } = fromReducer;
      const payload = {
        params,
        integrationId: mockIntegration.id
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

      initialState = addEventToState(initialState, mockIntegration);

      const payload = {
        deletedId: mockIntegration.id
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

      expect(error).not.toBeNull();
      expect(loading).toBe(false);
    });
  });

  describe('EDIT_INTEGRATION', () => {
    it('should set loading flag to true', () => {
      let { initialState } = fromReducer;

      initialState = addEventToState(initialState, mockIntegration);

      const payload = {
        params,
        body: mockIntegration,
        integrationId: mockIntegration.id
      };

      const action = new fromActions.EditIntegration(payload);
      const { loading, completedAction } = fromReducer.reducer(initialState, action);

      expect(loading).toBe(true);
      expect(completedAction).toBeNull();
    });
  });

  describe('EDIT_INTEGRATION_SUCCESS', () => {
    it('should update event integration', () => {
      let { initialState } = fromReducer;
      const updatedValue = 'EDITED';

      initialState = addEventToState(initialState, mockIntegration);

      const edited = {
        ...mockIntegration,
        feed_url: updatedValue
      };

      const payload = edited;

      const action = new fromActions.EditIntegrationSuccess(payload);
      const { error, data } = fromReducer.reducer(initialState, action);

      expect(error).toBeNull();
      expect(data[0].feed_url).toBe(updatedValue);
    });
  });

  describe('EDIT_INTEGRATION_FAIL', () => {
    it('should set error flag to true', () => {
      const { initialState } = fromReducer;

      const action = new fromActions.EditIntegrationFail(httpErrorResponse);
      const { error, loading } = fromReducer.reducer(initialState, action);

      expect(error).not.toBeNull();
      expect(loading).toBe(false);
    });
  });

  describe('DESTROY', () => {
    it('should reset completedAction and error keys', () => {
      const { initialState } = fromReducer;
      const action = new fromActions.Destroy();

      const { error, completedAction } = fromReducer.reducer(initialState, action);

      expect(error).toBeNull();
      expect(completedAction).toBeNull();
    });
  });

  describe('GET_HOSTS_SUCCESS', () => {
    it('should set hosts', () => {
      const { initialState } = fromReducer;
      const payload = [{ value: 1, label: 'fake' }];
      const action = new fromActions.GetHostsSuccess(payload);
      const { error, loading, hosts } = fromReducer.reducer(initialState, action);

      expect(error).toBeNull();
      expect(loading).toBe(false);
      expect(hosts).toEqual(payload);
    });
  });
});
