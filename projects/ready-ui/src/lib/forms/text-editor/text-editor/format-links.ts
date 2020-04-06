import Quill from 'quill';

const Link = Quill.import('formats/link');

export class FormatLinks extends Link {
  static protocolCheck(linkUrl: string) {
    const hasProtocol = linkUrl.startsWith('http://') || linkUrl.startsWith('https://');
    return hasProtocol ? linkUrl : `https://${linkUrl}`;
  }

  static sanitize(url) {
    return this.protocolCheck(url);
  }
}
