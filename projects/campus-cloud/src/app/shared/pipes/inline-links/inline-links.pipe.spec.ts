import { InlineLinksPipe } from './inline-links.pipe';

describe('InlineLinksPipe', () => {
  it('create an instance', () => {
    const pipe = new InlineLinksPipe();
    expect(pipe).toBeTruthy();
  });
});


describe('Check if Inline Links pipe return a html tag with link', () => {
  it('Links on text should become clickable', function() {
    const pipe = new InlineLinksPipe();
    const valueExample = 'Title www.link.com content Last content';
    const transformedValue: string = pipe.transform(valueExample);

    const result = 'Title <a href="www.link.com" target="_blank">www.link.com</a> content Last content';

    expect(transformedValue).toEqual(result);
  });

  it('Email address on text should become clickable', function() {
    const pipe = new InlineLinksPipe();
    const valueExample = 'Title my@email.com content, Last content';
    const transformedValue: string = pipe.transform(valueExample);

    const result = 'Title <a href="mailto:my@email.com" target="_blank">my@email.com</a> content, Last content';

    expect(transformedValue).toEqual(result);
  });

  it('Phone number on text should become clickable', function() {
    const pipe = new InlineLinksPipe();
    const valueExample = 'Title 0790900033 content, Last content';
    const transformedValue: string = pipe.transform(valueExample);

    const result = 'Title <a href="tel:0790900033" target="_blank">0790900033</a> content, Last content';

    expect(transformedValue).toEqual(result);
  });

  it('Phone number start with + should become clickable', function() {
    const pipe = new InlineLinksPipe();
    const valueExample = 'Title +31636363634 content, Last content';
    const transformedValue: string = pipe.transform(valueExample);

    const result = 'Title <a href="tel:+31636363634" target="_blank">+31636363634</a> content, Last content';

    expect(transformedValue).toEqual(result);
  });

});
