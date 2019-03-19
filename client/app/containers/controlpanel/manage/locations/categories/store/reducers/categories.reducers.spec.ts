import { HttpParams, HttpErrorResponse } from '@angular/common/http';

import * as fromActions from '../actions';
import { mockSchool } from '@app/session/mock';
import * as fromReducer from './categories.reducers';
import { mockCategories } from '@libs/locations/common/categories/tests';

const httpErrorResponse = new HttpErrorResponse({ error: true });

const pagination = {
  startRange: 1,
  endRange: 2
};

const params = new HttpParams().set('school_id', mockSchool.id.toString());

describe('Categories Reducer', () => {
  it('should GET categories', () => {
    const { initialState } = fromReducer;
    const payload = {
      ...pagination,
      params
    };
    const action = new fromActions.GetCategories(payload);
    const result = fromReducer.reducer(initialState, action);
    const { loading } = result;

    expect(loading).toBe(true);
  });

  it('should GET categories success', () => {
    const { initialState } = fromReducer;

    const action = new fromActions.GetCategoriesSuccess(mockCategories);
    const { data, error, loaded, loading } = fromReducer.reducer(initialState, action);

    expect(error).toBe(false);
    expect(loaded).toBe(true);
    expect(loading).toBe(false);
    expect(data.length).toBe(2);
  });

  it('should GET categories fail', () => {
    const { initialState } = fromReducer;

    const action = new fromActions.GetCategoriesFail(httpErrorResponse);
    const { error, loaded, loading } = fromReducer.reducer(initialState, action);

    expect(error).toBe(true);
    expect(loaded).toBe(false);
    expect(loading).toBe(false);
  });

  it('should POST category', () => {
    const { initialState } = fromReducer;
    const body = mockCategories[0];
    const payload = {
      body,
      params
    };

    const action = new fromActions.PostCategory(payload);
    const { loading, error } = fromReducer.reducer(initialState, action);

    expect(error).toBe(false);
    expect(loading).toBe(true);
  });

  it('should POST category success', () => {
    const { initialState } = fromReducer;
    const payload = mockCategories[0];

    const action = new fromActions.PostCategorySuccess(payload);
    const { data, filteredCategories, loading, error } = fromReducer.reducer(initialState, action);

    expect(error).toBe(false);
    expect(loading).toBe(false);
    expect(data.length).toEqual(1);
    expect(filteredCategories.length).toEqual(1);
  });

  it('should POST category fail', () => {
    const { initialState } = fromReducer;

    const action = new fromActions.PostCategoryFail(httpErrorResponse);
    const { error, loading } = fromReducer.reducer(initialState, action);

    expect(error).toBe(true);
    expect(loading).toBe(false);
  });

  it('should EDIT category', () => {
    const { initialState } = fromReducer;
    const body = mockCategories[0];
    const payload = {
      body,
      params,
      categoryId: mockCategories[0].id
    };

    const action = new fromActions.EditCategory(payload);
    const { loading, error } = fromReducer.reducer(initialState, action);

    expect(error).toBe(false);
    expect(loading).toBe(true);
  });

  it('should EDIT category success', () => {
    const { initialState } = fromReducer;
    const payload = mockCategories[0];

    const action = new fromActions.EditCategorySuccess(payload);
    const { loading, error } = fromReducer.reducer(initialState, action);

    expect(error).toBe(false);
    expect(loading).toBe(false);
  });

  it('should EDIT category fail', () => {
    const { initialState } = fromReducer;

    const action = new fromActions.EditCategoryFail(httpErrorResponse);
    const { error, loading } = fromReducer.reducer(initialState, action);

    expect(error).toBe(true);
    expect(loading).toBe(false);
  });

  it('should DELETE category', () => {
    const { initialState } = fromReducer;
    const payload = {
      params,
      body: mockCategories[0]
    };

    const action = new fromActions.DeleteCategories(payload);
    const { error, loading } = fromReducer.reducer(initialState, action);

    expect(error).toBe(false);
    expect(loading).toBe(true);
  });

  it('should DELETE category success', () => {
    const { initialState } = fromReducer;

    const payload = {
      params,
      deletedId: mockCategories[0].id
    };

    const action = new fromActions.DeleteCategoriesSuccess(payload);
    const { error, loading } = fromReducer.reducer(initialState, action);

    expect(error).toBe(false);
    expect(loading).toBe(false);
  });

  it('should DELETE category fail', () => {
    const { initialState } = fromReducer;
    const errorResponse = 'associated_to_location';

    const action = new fromActions.DeleteCategoriesFail(errorResponse);
    const { errorMessage, error, loading } = fromReducer.reducer(initialState, action);

    expect(error).toBe(true);
    expect(loading).toBe(false);
    expect(errorMessage).toEqual(errorMessage);
  });
});
