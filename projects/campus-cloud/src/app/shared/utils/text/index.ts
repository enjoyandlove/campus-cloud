import { validUrlRequiredProtocol } from '../forms';

export function protocolCheck(linkUrl: string) {
  const hasProtocol = validUrlRequiredProtocol.test(linkUrl);
  return hasProtocol ? linkUrl : `https://${linkUrl}`;
}
