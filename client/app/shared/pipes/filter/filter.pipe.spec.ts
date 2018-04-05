import { CPFilterPipe } from './filter.pipe';

const mockData = [
  {'firstname': 'Andres', 'lastname': 'Roget'},
  {'firstname': 'John', 'lastname': 'Doe'}
];

describe('CPFilterPipe', () => {
  const pipe = new CPFilterPipe();

  it('Should return "filterBy" attribute with "No Results" if filterBy is an Array', () => {
    const query = pipe.transform(mockData, { query: 'xxxx', filterBy: ['firstname', 'lastname'] });
    expect(query[0]['noResults']).toBeTruthy();
  });

  it('Should return "filterBy" attribute with "No Results" if filterBy is an Obj', () => {
    const query = pipe.transform(mockData, { query: 'xxxx', filterBy: 'firstname' });
    expect(query[0]['firstname']).toContain('No Results');
  });

  it('Filter By attributes should be case insensitive', () => {
    let query;
    const caseOptions = ['rog', 'ROG', 'Rog'];

    caseOptions.forEach((caseSensitiveQuery) => {
      query = pipe.transform(mockData, { query: caseSensitiveQuery, filterBy: 'lastname' });
      expect(query.length).toBe(1);
    });
  });

  it('Should filter by either attribute when provied an Array of filterBy options', () => {
    const query = pipe.transform(mockData, { query: 'rog', filterBy: ['firstname', 'lastname'] });
    expect(query.length).toBe(1);
    expect(query[0].lastname).toContain('Roget');
  });

  it('Filter input data based on provided filterBy attribute', () => {
    const query = pipe.transform(mockData, { query: 'andres', filterBy: 'firstname' });
    expect(query.length).toBe(1);
  });
});
