import { of as observableOf } from 'rxjs';

import { BaseComponent } from './base.component';

class BaseComponentMock extends BaseComponent {}

describe('BaseComponent', () => {
  let comp: BaseComponent;

  beforeEach(() => {
    comp = new BaseComponentMock();
    comp.resetPagination();
  });

  it('should init with default values', () => {
    expect(comp.pageNumber).toEqual(1);
    expect(comp.startRange).toEqual(1);
    expect(comp.endRange).toEqual(101);
  });

  it('should goToPrevious', () => {
    comp.goToPrevious();
    expect(comp.pageNumber).toEqual(1);
    expect(comp.startRange).toEqual(1);
    expect(comp.endRange).toEqual(101);

    comp.pageNumber = 2;
    comp.startRange = 101;
    comp.endRange = 201;

    comp.goToPrevious();

    expect(comp.pageNumber).toEqual(1);
    expect(comp.startRange).toEqual(1);
    expect(comp.endRange).toEqual(101);
  });

  it('goToNext', () => {
    comp.goToNext();
    expect(comp.pageNumber).toEqual(2);
    expect(comp.startRange).toEqual(101);
    expect(comp.endRange).toEqual(201);
  });

  it('resetPagination', () => {
    comp.goToNext();
    comp.resetPagination();

    expect(comp.pageNumber).toEqual(1);
    expect(comp.startRange).toEqual(1);
    expect(comp.endRange).toEqual(101);
  });

  it('fetchData', () => {
    const arr = [];
    for (let i = 1; i <= 200; i++) {
      arr.push(i);
    }

    const fakeRequest = observableOf(arr);

    comp.fetchData(fakeRequest).then((res) => {
      expect(comp.pageNext).toBeTruthy();
      expect(comp.pagePrev).toBeFalsy();
      expect(res.data.length).toBe(199);
    });
  });
});
