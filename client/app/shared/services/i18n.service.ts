import { Injectable } from '@angular/core';

const noTranslateRegex = new RegExp(/\[(NOTRANSLATE)\]/g);

declare var navigator;

const defaultLocale = 'en-US';
const sourceFile = (lang) => require('../../config/locales/' + lang + '.json');
const browserLanguage =
  navigator.userLanguage || navigator.language || defaultLocale;
const locale = browserLanguage.toLowerCase().startsWith('fr')
  ? 'fr-CA'
  : 'en-US';

@Injectable()
export class CPI18nService {
  static getLocale() {
    return locale;
  }

  translate(key: string) {
    const doNotTranslate = noTranslateRegex.test(key);

    if (doNotTranslate) {
      return key.replace(noTranslateRegex, '');
    }

    const translatedString = sourceFile(locale)[key];

    return translatedString ? translatedString.message : `_${key}_`;
  }
}
