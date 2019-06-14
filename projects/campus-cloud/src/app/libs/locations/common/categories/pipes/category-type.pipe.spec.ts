import { isDefault } from '../model';
import { CategoryTypePipe } from './category-type.pipe';

describe('CategoryTypePipe', () => {
  let pipe: CategoryTypePipe;

  beforeEach(() => {
    pipe = new CategoryTypePipe();
  });

  it('should convert Yes', () => {
    const expected = isDefault.true;
    const result = pipe.transform(true);

    expect(result).toEqual(expected);
  });

  it('should convert to No', () => {
    const expected = isDefault.false;
    const result = pipe.transform(false);

    expect(result).toEqual(expected);
  });
});
