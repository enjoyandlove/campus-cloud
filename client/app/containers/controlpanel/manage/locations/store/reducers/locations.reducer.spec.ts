import { HttpParams, HttpErrorResponse } from '@angular/common/http';

import * as fromActions from '../actions';
import { mockSchool } from '@app/session/mock';
import * as fromReducer from './locations.reducer';
import { mockLocations } from '@libs/locations/common/tests';

const httpErrorResponse = new HttpErrorResponse({ error: true });

const pagination = {
  startRange: 1,
  endRange: 2
};


const params = new HttpParams().set('school_id', mockSchool.id.toString());

describe('Locations Reducer', () => {
  it('should GET location', () => {
    const { initialState } = fromReducer;
    const payload = {
      ...pagination,
      params
    };
    const action = new fromActions.GetLocations(payload);
    const result = fromReducer.reducer(initialState, action);
    const { loading } = result;

    expect(loading).toBe(true);
  });

  it('should GET location entities success', () => {
    const { initialState } = fromReducer;

    const action = new fromActions.GetLocationsSuccess(mockLocations);
    const { entities, error, loaded, loading } = fromReducer.reducer(initialState, action);

    expect(error).toBe(false);
    expect(loaded).toBe(true);
    expect(loading).toBe(false);
    expect(entities[mockLocations[0].id]).toEqual(mockLocations[0]);
  });

  it('should GET location entities fail', () => {
    const { initialState } = fromReducer;

    const action = new fromActions.GetLocationsFail(httpErrorResponse);
    const { error, loaded, loading } = fromReducer.reducer(initialState, action);

    expect(error).toBe(true);
    expect(loaded).toBe(false);
    expect(loading).toBe(false);
  });

  it('should POST location', () => {
    const { initialState } = fromReducer;
    const body = mockLocations[0];
    const payload = {
      body,
      params
    };

    const action = new fromActions.PostLocation(payload);
    const { loading, error } = fromReducer.reducer(initialState, action);

    expect(error).toBe(false);
    expect(loading).toBe(true);
  });

  it('should POST location success', () => {
    const { initialState } = fromReducer;
    const payload = mockLocations[0];

    const action = new fromActions.PostLocationSuccess(payload);
    const { entities, loading, error } = fromReducer.reducer(initialState, action);

    expect(error).toBe(false);
    expect(loading).toBe(false);
    expect(entities[mockLocations[0].id]).toEqual(mockLocations[0]);
  });

  it('should POST location fail', () => {
    const { initialState } = fromReducer;

    const action = new fromActions.PostLocationFail(httpErrorResponse);
    const { error, loaded, loading } = fromReducer.reducer(initialState, action);

    expect(error).toBe(true);
    expect(loaded).toBe(true);
    expect(loading).toBe(false);
  });

  it('should EDIT location', () => {
    const { initialState } = fromReducer;
    const body = mockLocations[0];
    const payload = {
      body,
      params,
      updatedCategory: 'No',
      locationId: mockLocations[0].id,
      categoryId: mockLocations[0].category_id
    };

    const action = new fromActions.EditLocation(payload);
    const { loading, error } = fromReducer.reducer(initialState, action);

    expect(error).toBe(false);
    expect(loading).toBe(false);
  });

  it('should EDIT location success', () => {
    const { initialState } = fromReducer;
    const payload = {
      data: mockLocations[0],
      categoryId: mockLocations[0].category_id
    };

    const action = new fromActions.EditLocationSuccess(payload);
    const { loading, error } = fromReducer.reducer(initialState, action);

    expect(error).toBe(false);
    expect(loading).toBe(false);
  });

  it('should EDIT location fail', () => {
    const { initialState } = fromReducer;

    const action = new fromActions.EditLocationFail(httpErrorResponse);
    const { error, loaded, loading } = fromReducer.reducer(initialState, action);

    expect(error).toBe(true);
    expect(loaded).toBe(true);
    expect(loading).toBe(false);
  });

  it('should DELETE location', () => {
    const { initialState } = fromReducer;

    const action = new fromActions.DeleteLocation(mockLocations[0]);
    const { error, loaded, loading } = fromReducer.reducer(initialState, action);

    expect(error).toBe(false);
    expect(loaded).toBe(true);
    expect(loading).toBe(true);
  });

  it('should DELETE location success', () => {
    const { initialState } = fromReducer;

    const payload = {
      params,
      deletedId: mockLocations[0].id,
      categoryId: mockLocations[0].category_id
    };

    const action = new fromActions.DeleteLocationSuccess(payload);
    const { error, loaded, loading } = fromReducer.reducer(initialState, action);

    expect(error).toBe(false);
    expect(loaded).toBe(true);
    expect(loading).toBe(false);
  });

  it('should DELETE location fail', () => {
    const { initialState } = fromReducer;

    const action = new fromActions.DeleteLocationFail(httpErrorResponse);
    const { error, loading, loaded } = fromReducer.reducer(initialState, action);

    expect(error).toBe(true);
    expect(loaded).toBe(true);
    expect(loading).toBe(false);
  });
});
