export function protocolCheck(linkUrl: string) {
  const hasProtocol = linkUrl.startsWith('http://') || linkUrl.startsWith('https://');
  return hasProtocol ? linkUrl : `https://${linkUrl}`;
}
