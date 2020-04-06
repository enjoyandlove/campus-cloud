import { Injectable } from '@angular/core';

import { protocolCheck } from '@campus-cloud/shared/utils';

@Injectable({
  providedIn: 'root'
})
export class TermsOfUseUtilsService {
  constructor() {}

  /**
   * It will return random 8 digits
   * i.e 87541258
   */
  static getEightDigitRandomNum() {
    return Math.floor(Math.random() * 90000000) + 10000000;
  }

  /**
   * It will replace spaces with underscore between the words and make it lowercase
   * and prefix and suffix random eight digit with underscore make it unique
   * and return the unique placeholder
   * i.e 'Hello World' to `45215425_hello_world_78458585`
   */
  static getLinkPlaceholder(str) {
    const string = str
      .split(' ')
      .join('_')
      .toLocaleLowerCase();

    return `${this.getEightDigitRandomNum() + '_' + string + '_' + this.getEightDigitRandomNum()}`;
  }

  /**
   * It will parse content added in texteditor to a format
   * supported by API (separate tos_str and tos_data_dict)
   * i.e return:
   * {
      "tos_str": "Campus Cloud allows you to 45125252_p_85458587 your campus tos.",
      "tos_data_dict": {
      "45125252_p_85458587": ["publish", "https://www.publish.com"]
        }
      }
   */
  static parseContentToAPI(data) {
    let tos = '';
    let tosLinks = {};
    data.map(({ insert, attributes }) => {
      if (attributes && attributes['link']) {
        const placeholder = this.getLinkPlaceholder(insert);
        tos += placeholder;
        tosLinks = {
          ...tosLinks,
          [placeholder]: [insert, protocolCheck(attributes['link'])]
        };
      } else {
        tos += insert;
      }
    });

    return { tos_data_dict: tosLinks, tos_str: tos };
  }

  /**
   * It will parse content coming from API
   * regex find placeholder i.e 45125252_hw_85458587
   * (start and end with 8 digits and underscore)
   * from content and replace with link in a format
   * supported by quill texteditor
   * i.e returns
   *[
      { insert: 'Campus Cloud allows you to ' },
      { insert: 'publish', attributes: { link: 'https//:www.publish.com' } },
      { insert: 'your campus tos.' }
    ]
   */
  static parseContentFromAPI(data) {
    return data.tos_str
      .split(/(\d{8}_[^\s]+_\d{8})/)
      .map((tos) => ({
        tos,
        links: data['tos_data_dict'] ? data.tos_data_dict[tos] : null
      }))
      .map(({ tos, links }) =>
        links ? { insert: links[0], attributes: { link: links[1] } } : { insert: tos }
      );
  }
}
