import { HttpErrorResponse } from '@angular/common/http';

import * as fromActions from '../actions';
import * as fromReducer from './api-management.reducer';

import { mockAPIData } from '@controlpanel/api-management/tests';

const { initialState } = fromReducer;

const httpErrorResponse = new HttpErrorResponse({ error: true });

describe('API Management Reducer', () => {
  describe('GET ACCESS TOKENS', () => {
    it('should show loading true', () => {
      const action = fromActions.loadRequest();

      const result = fromReducer.reducer(initialState, action);

      const { loading } = result;

      expect(loading).toBe(true);
    });

    it('should load access tokens success', () => {
      const payload = {
        next: false,
        previous: false,
        data: mockAPIData
      };

      const action = fromActions.loadSuccess(payload);

      const result = fromReducer.reducer(initialState, action);

      const { loading, loaded, previous, next, entities } = result;

      expect(next).toBe(false);
      expect(loaded).toBe(true);
      expect(loading).toBe(false);
      expect(previous).toBe(false);
      expect(entities[mockAPIData[0].id]).toEqual(mockAPIData[0]);
    });

    it('should load access tokens error', () => {
      const action = fromActions.loadFailure(httpErrorResponse);

      const result = fromReducer.reducer(initialState, action);

      const { loading, error } = result;

      expect(loading).toBe(false);
      expect(error).toBe(httpErrorResponse.error);
    });
  });

  describe('POST ACCESS TOKENS', () => {
    it('should show loading true', () => {
      const payload = mockAPIData[0];

      const action = fromActions.postRequest({ payload });

      const result = fromReducer.reducer(initialState, action);

      const { loading } = result;

      expect(loading).toBe(true);
    });

    it('should post access token success', () => {
      const data = mockAPIData[0];

      const action = fromActions.postSuccess({ data });

      const result = fromReducer.reducer(initialState, action);

      const { loading, entities } = result;

      expect(loading).toBe(false);
      expect(entities[mockAPIData[0].id]).toEqual(mockAPIData[0]);
    });

    it('should post access token error', () => {
      const action = fromActions.postFailure(httpErrorResponse);

      const result = fromReducer.reducer(initialState, action);

      const { loading, error } = result;

      expect(loading).toBe(false);
      expect(error).toBe(httpErrorResponse.error);
    });
  });

  describe('UPDATE ACCESS TOKENS', () => {
    it('should show loading true', () => {
      const payload = {
        body: mockAPIData[0],
        tokenId: mockAPIData[0].id
      };

      const action = fromActions.editRequest({ payload });

      const result = fromReducer.reducer(initialState, action);

      const { entityLoading } = result;

      expect(entityLoading).toBe(true);
    });

    it('should update access token success', () => {
      const data = mockAPIData[0];

      const action = fromActions.editSuccess({ data });

      const result = fromReducer.reducer(initialState, action);

      const { loading } = result;

      expect(loading).toBe(false);
    });

    it('should update access token error', () => {
      const action = fromActions.editFailure(httpErrorResponse);

      const result = fromReducer.reducer(initialState, action);

      const { loading, error } = result;

      expect(loading).toBe(false);
      expect(error).toBe(httpErrorResponse.error);
    });
  });

  describe('DELETE ACCESS TOKENS', () => {
    it('should show loading true', () => {
      const payload = mockAPIData[0];

      const action = fromActions.deleteRequest({ payload });

      const result = fromReducer.reducer(initialState, action);

      const { loading, error } = result;

      expect(error).toBeNull();
      expect(loading).toBe(true);
    });

    it('should delete access token success', () => {
      const deletedId = mockAPIData[0].id;

      const action = fromActions.deleteSuccess({ deletedId });

      const result = fromReducer.reducer(initialState, action);

      const { loading, error } = result;

      expect(error).toBeNull();
      expect(loading).toBe(false);
    });

    it('should delete access token error', () => {
      const action = fromActions.deleteFailure(httpErrorResponse);

      const result = fromReducer.reducer(initialState, action);

      const { loading, error } = result;

      expect(loading).toBe(false);
      expect(error).toBe(httpErrorResponse.error);
    });
  });
});
