import { TeamSelectedPipe } from '../selected.pipe';

describe('TeamSelectedPipe', () => {
  let pipe: TeamSelectedPipe;

  beforeEach(() => {
    pipe = new TeamSelectedPipe();
  });

  it('should only return records which has checked true', () => {
    const data = [{ name: 'James', checked: false }, { name: 'Kamran', checked: true }];

    const expected = [{ name: 'Kamran', checked: true }];
    const result = pipe.transform(data);

    expect(result).toEqual(expected);
  });
});
