import { AudienceFilterPipe } from './filters.pipe';

describe('AudienceFilterPipe', () => {
  const pipe = new AudienceFilterPipe();

  it('should transform', () => {
    const filters = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
    const usedFilters = [1, 2, 3];

    expect(pipe.transform(filters, usedFilters)).toEqual([{ id: 4 }]);
  });
});
