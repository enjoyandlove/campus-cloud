import { Injectable } from '@angular/core';

declare var navigator;

const defaultLocale = 'en-US';
const sourceFile = (lang) => require('../../config/locales/' + lang + '.json');
const browserLanguage = navigator.userLanguage || navigator.language || defaultLocale;
const locale = browserLanguage.toLowerCase().startsWith('fr') ? 'fr-CA' : 'en-US';

@Injectable()
export class CPI18nService {

  translate(key: string) {
    const translatedString = sourceFile(locale)[key];

    if (translatedString) {
      return translatedString.message;
    } else if (sourceFile(defaultLocale)[key]) {
      return sourceFile(defaultLocale)[key].message
    }

    return key;
  }
}
