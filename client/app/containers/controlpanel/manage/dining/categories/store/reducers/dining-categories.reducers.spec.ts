import { HttpParams, HttpErrorResponse } from '@angular/common/http';

import * as fromActions from '../actions';
import { mockSchool } from '@app/session/mock';
import * as fromReducer from './dining-categories.reducers';
import { mockCategories } from '@libs/locations/common/categories/tests';

const { initialState } = fromReducer;
const httpErrorResponse = new HttpErrorResponse({ error: true });
const params = new HttpParams().set('school_id', mockSchool.id.toString());

describe('Dining Categories Reducer', () => {
  it('should set loading flag on getCategories', () => {
    const action = new fromActions.GetCategories();
    const result = fromReducer.reducer(initialState, action);
    const { loading } = result;

    expect(loading).toBe(true);
  });

  it('should GET categories on success', () => {
    const action = new fromActions.GetCategoriesSuccess(mockCategories);
    const { entities, error, loaded, loading } = fromReducer.reducer(initialState, action);

    expect(error).toBe(false);
    expect(loaded).toBe(true);
    expect(loading).toBe(false);
    expect(entities[mockCategories[0].id]).toEqual(mockCategories[0]);
  });

  it('should set error flag true on getCategories fail', () => {
    const action = new fromActions.GetCategoriesFail(httpErrorResponse);
    const { error, loaded, loading } = fromReducer.reducer(initialState, action);

    expect(error).toBe(true);
    expect(loaded).toBe(false);
    expect(loading).toBe(false);
  });

  it('should set error, loading flags on POST category', () => {
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

  it('should POST category on success', () => {
    const payload = mockCategories[0];

    const action = new fromActions.PostCategorySuccess(payload);
    const { filteredCategories, entities, loading, error } = fromReducer.reducer(
      initialState,
      action
    );

    expect(error).toBe(false);
    expect(loading).toBe(false);
    expect(filteredCategories.length).toEqual(1);
    expect(entities[mockCategories[0].id]).toEqual(mockCategories[0]);
  });

  it('should set error flag true on POST category fail', () => {
    const action = new fromActions.PostCategoryFail(httpErrorResponse);
    const { error, loading } = fromReducer.reducer(initialState, action);

    expect(error).toBe(true);
    expect(loading).toBe(false);
  });

  it('should set error, loading flag on EDIT category', () => {
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

  it('should error flag false on EDIT category success', () => {
    const payload = mockCategories[0];

    const action = new fromActions.EditCategorySuccess(payload);
    const { loading, error } = fromReducer.reducer(initialState, action);

    expect(error).toBe(false);
    expect(loading).toBe(false);
  });

  it('should set error flag true EDIT category fail', () => {
    const action = new fromActions.EditCategoryFail();
    const { error, loading } = fromReducer.reducer(initialState, action);

    expect(error).toBe(true);
    expect(loading).toBe(false);
  });

  it('should set error, loading flags on DELETE category', () => {
    const action = new fromActions.DeleteCategories(mockCategories[0]);
    const { error, loading } = fromReducer.reducer(initialState, action);

    expect(error).toBe(false);
    expect(loading).toBe(true);
  });

  it('should set error flag false on DELETE category success', () => {
    const payload = {
      params,
      deletedId: mockCategories[0].id
    };

    const action = new fromActions.DeleteCategoriesSuccess(payload);
    const { error, loading } = fromReducer.reducer(initialState, action);

    expect(error).toBe(false);
    expect(loading).toBe(false);
  });

  it('should set error flag true on DELETE category fail', () => {
    const action = new fromActions.DeleteCategoriesFail();
    const { error, loading } = fromReducer.reducer(initialState, action);

    expect(error).toBe(true);
    expect(loading).toBe(false);
  });
});
