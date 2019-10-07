import { TeamFilterPipe } from '../filter.pipe';

describe('TeamFilterPipe', () => {
  let pipe: TeamFilterPipe;

  beforeEach(() => {
    pipe = new TeamFilterPipe();
  });

  it('should filter data by name', () => {
    const data = [{ data: { name: 'James' } }, { data: { name: 'Kamran' } }];

    const expected = [{ data: { name: 'Kamran' } }];
    const result = pipe.transform(data, { query: 'Kamran', filterBy: 'name' });

    expect(result).toEqual(expected);
  });

  it('should filter data by name (capital letter)', () => {
    const data = [{ data: { name: 'James' } }, { data: { name: 'Kamran' } }];

    const expected = [{ data: { name: 'Kamran' } }];
    const result = pipe.transform(data, { query: 'KAMRAN', filterBy: 'name' });

    expect(result).toEqual(expected);
  });
});
