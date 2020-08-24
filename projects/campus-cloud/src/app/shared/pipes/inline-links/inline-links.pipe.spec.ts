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
    const valueExample = 'Title http://www.link.com content Last content';
    const transformedValue: string = pipe.transform(valueExample);

    const result =
      'Title <a href="http://www.link.com" target="_blank">http://www.link.com</a> content Last content';

    expect(transformedValue).toEqual(result);
  });

  it('Link start with www on text should become clickable and point to right url', function() {
    const pipe = new InlineLinksPipe();
    const valueExample = 'Title www.link.com content Last content';
    const transformedValue: string = pipe.transform(valueExample);

    const result =
      'Title <a href="http://www.link.com" target="_blank">www.link.com</a> content Last content';

    expect(transformedValue).toEqual(result);
  });

  it('Email address on text should become clickable', function() {
    const pipe = new InlineLinksPipe();
    const valueExample = 'Title my@email.com content, Last content';
    const transformedValue: string = pipe.transform(valueExample);

    const result =
      'Title <a href="mailto:my@email.com" target="_blank">my@email.com</a> content, Last content';

    expect(transformedValue).toEqual(result);
  });

  it('Phone number on text should become clickable', function() {
    const pipe = new InlineLinksPipe();
    const valueExample = 'Title 0790900033 content, Last content';
    const transformedValue: string = pipe.transform(valueExample);

    const result =
      'Title <a href="tel:0790900033" target="_blank">0790900033</a> content, Last content';

    expect(transformedValue).toEqual(result);
  });

  it('Phone number start with + should become clickable', function() {
    const pipe = new InlineLinksPipe();
    const valueExample = 'Title +31636363634 content, Last content';
    const transformedValue: string = pipe.transform(valueExample);

    const result =
      'Title <a href="tel:+31636363634" target="_blank">+31636363634</a> content, Last content';

    expect(transformedValue).toEqual(result);
  });
});

describe('Test big links, email and phone number on the same text', function() {
  it('should return clickable link on the provided text', function() {
    const pipe = new InlineLinksPipe();
    // tslint:disable-next-line:max-line-length
    const text =
      'Please complete this self-reporting form to inform us if you ' +
      'have been tested with COVID-19 symptoms from a health professional\n' +
      '\n' +
      'www.google.com\n' +
      '\n' +
      '5145038961' +
      '\n' +
      'email@email.com';

    const transformedText: string = pipe.transform(text);

    const expectedResult =
      'Please complete this self-reporting form to inform us if you ' +
      'have been tested with COVID-19 symptoms from a health professional\n' +
      '\n' +
      '<a href="http://www.google.com" target="_blank">www.google.com</a>\n' +
      '\n' +
      '<a href="tel:5145038961" target="_blank">5145038961</a>' +
      '\n' +
      '<a href="mailto:email@email.com" target="_blank">email@email.com</a>';

    expect(transformedText).toEqual(expectedResult);
  });
});
