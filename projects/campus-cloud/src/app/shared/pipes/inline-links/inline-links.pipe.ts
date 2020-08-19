import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'inlineLinks'
})
export class InlineLinksPipe implements PipeTransform {

  WEB_SITE_REGX: RegExp = new RegExp('(((http)|(https):\\/\\/)|(www))\\S+[\\/|\\w$]', 'g');
  PHONE_NUMBER_REGX: RegExp = new RegExp(
    '\\+?[0-9\\(][\\(\\)\\.\\s0-9\\-]{6,}[0-9]', 'g');
  EMAIL_REGX: RegExp = new RegExp('\\S+@\\S+\\.\\S+', 'g');

  transform(value: string, ...args: unknown[]): string {
    value = this.hyperLinking(value, this.WEB_SITE_REGX, '');
    value = this.hyperLinking(value, this.PHONE_NUMBER_REGX, 'tel:');
    value = this.hyperLinking(value, this.EMAIL_REGX, 'mailto:');

    return value;
  }

  hyperLinking(text: string, regex: RegExp, prefix: string) {
    const matches: RegExpMatchArray = (text.match(regex) || []);

    if (matches.length) {
      matches.forEach(match => {
        text = this.replaceAll(text, match,
          '<a href="' + prefix + match + '" target="_blank">' + match + '</a>');
      });
    }
    return text;
  }

  replaceAll(str, find, replace) {
    return str.replace(find, replace);
  }

}
