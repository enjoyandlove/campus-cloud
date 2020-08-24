import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'inlineLinks'
})
export class InlineLinksPipe implements PipeTransform {
  WEB_SITE_REGX: RegExp = new RegExp('(((http)|(https):\\/\\/)|(www))\\S+[\\/|\\w$]', 'g');
  PHONE_NUMBER_REGX: RegExp = new RegExp('\\+?[0-9\\(][\\(\\)\\.\\s0-9\\-]{6,}[0-9]', 'g');
  EMAIL_REGX: RegExp = new RegExp('\\S+@\\S+\\.\\S+', 'g');

  transform(value: string, ...args: unknown[]): string {
    value = this.hyperLinking(value, this.WEB_SITE_REGX, 'http://', (link) =>
      link.startsWith('www')
    );
    value = this.hyperLinking(value, this.PHONE_NUMBER_REGX, 'tel:', () => true);
    value = this.hyperLinking(value, this.EMAIL_REGX, 'mailto:', () => true);

    return value;
  }

  hyperLinking(
    text: string,
    regex: RegExp,
    prefix: string,
    prefixValidation: (link: string) => boolean
  ) {
    const matches: RegExpMatchArray = text.match(regex) || [];

    if (matches.length) {
      matches.forEach((match) => {
        text = this.replaceAll(
          text,
          match,
          '<a href="' +
            (prefixValidation(match) ? prefix : '') +
            match +
            '" target="_blank">' +
            match +
            '</a>'
        );
      });
    }
    return text;
  }

  replaceAll(str, find, replace) {
    return str.replace(find, replace);
  }
}
