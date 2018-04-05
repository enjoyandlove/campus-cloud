import { appStorage } from './storage';

const mockKey = 'mockKey';
const mockValue = 'mockValue';

describe('appStorage', () => {
  it('should set item in storage', () => {
    appStorage.set(mockKey, mockValue);
    expect(appStorage.get(mockKey)).toBe(mockValue);
  });

  it('should return null if not found', () => {
    expect(appStorage.get('fakeKey')).toBeNull();
  });

  it('should clear local storage', () => {
    appStorage.set(mockKey, mockValue);
    expect(appStorage.get(mockKey)).toBe(mockValue);
    appStorage.clear();
    expect(appStorage.get(mockKey)).toBeNull();
  });
});
