import { CPObj } from './object';

const mockObject = {'firstname': 'Andres', 'lastname': null, 'age': null};
const mockArray = [ mockObject ];

describe('CPObj', () => {
  it('Should clean all null values from input', () => {
    expect(CPObj.cleanNullValues(mockObject)['age']).toBeUndefined();
    expect(CPObj.cleanNullValues(mockObject)['firstname']).toBeDefined();
    expect(CPObj.cleanNullValues(mockObject)['firstname']).toBe('Andres');
    expect(CPObj.cleanNullValues(mockObject)['lastname']).toBeUndefined();
    expect(CPObj.cleanNullValues(mockObject)['age']).toBeUndefined();
  })

  it('Should return input as is if input is an Array', () => {
    expect(CPObj.cleanNullValues(mockArray).length).toBe(1);
    expect(CPObj.cleanNullValues(mockArray)[0]['firstname']).toBeDefined();
    expect(CPObj.cleanNullValues(mockArray)[0]['firstname']).toBe('Andres');
    expect(CPObj.cleanNullValues(mockArray)[0]['lastname']).toBeNull();
    expect(CPObj.cleanNullValues(mockArray)[0]['age']).toBeNull();
  })
})
