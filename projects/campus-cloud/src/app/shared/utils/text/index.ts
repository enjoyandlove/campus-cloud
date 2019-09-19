export function protocolCheck(linkUrl: string) {
  const hasProtocol = linkUrl.startsWith('http://') || linkUrl.startsWith('https://');
  return hasProtocol ? linkUrl : `https://${linkUrl}`;
}

/**
 *
 * @param text: string
 * given an string input it returns an html link
 * for those strings in the text that match a link element
 */
export function urlify(text: string) {
  const urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
  return text.replace(urlRegex, function(match, _, child2) {
    const url2 = child2 === 'www.' ? 'http://' + match : match;
    return '<a href="' + url2 + '" target="_blank">' + match + '</a>';
  });
}
