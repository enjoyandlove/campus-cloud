export function isSupported() {
  const supportedBrowsers = require('../../../../assets/supportedBrowsers.js');
  return supportedBrowsers.test(navigator.userAgent);
}
