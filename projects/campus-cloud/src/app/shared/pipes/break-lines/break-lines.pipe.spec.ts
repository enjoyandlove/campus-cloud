import { BreakLinesPipe } from './break-lines.pipe';

describe('BreakLinesPipe', () => {
  it('create an instance', () => {
    const pipe = new BreakLinesPipe();
    expect(pipe).toBeTruthy();
  });
});

describe('Check if Break lines pipe return string with br tag', () => {
  it('Value should contains br tag after transformation ', function() {
    const pipe = new BreakLinesPipe();
      const valueExample = 'First Line \nNext line \nLat line';
    const transformedValue: string = pipe.transform(valueExample);

    const count = (transformedValue.match(/(<br>)/g) || []).length;

    expect(count).toEqual(2);
  });
});
