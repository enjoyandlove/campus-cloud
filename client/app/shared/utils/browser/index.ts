import * as Bowser from 'bowser';
import browserslist = require('browserslist');

export function getSupportedBrowser() {
  return browserslist('last 2 years, not dead, not IE 9-11');
}

export function getBrowser() {
  return Bowser.getParser(window.navigator.userAgent).getBrowser();
}

export function isSupported() {
  const { name, version } = getBrowser();
  const supportedBrowsers = getSupportedBrowser();
  const parsedBrowser = `${name.toLowerCase()} ${Number(version).toFixed()}`;
  return supportedBrowsers.includes(parsedBrowser);
}
