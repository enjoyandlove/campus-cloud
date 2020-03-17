import { Pipe, PipeTransform } from '@angular/core';

import { CPI18nService } from '@campus-cloud/shared/services';

@Pipe({ name: 'privacyLink' })
export class TermsOfUsePipe implements PipeTransform {
  constructor(private cpI18n: CPI18nService) {}

  static createURL(text, url) {
    return '<a href="' + url + '" target="_blank">' + text + '</a>';
  }

  /**
   * It does two things:
   *  1. Translate phraseapp key
   *  2. Replace placeholders in phraseapp translations
   *     i.e (%privacy and %tos) with their links.
   */
  transform(key: string): string {
    let translatedString = this.cpI18n.translate(key);

    const tosUrl = 'https://www.readyeducation.com/tos';
    const tosLabel = this.cpI18n.translate('t_terms_of_use_tos');
    const privacyUrl = 'https://www.readyeducation.com/privacy';
    const privacyLabel = this.cpI18n.translate('t_terms_of_use_privacy_policy');

    const tos = TermsOfUsePipe.createURL(tosLabel, tosUrl);
    const privacy = TermsOfUsePipe.createURL(privacyLabel, privacyUrl);

    translatedString = translatedString.replace('%privacy', privacy);
    translatedString = translatedString.replace('%tos', tos);

    return translatedString;
  }
}
