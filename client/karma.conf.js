process.env.CHROME_BIN = require('puppeteer').executablePath();
process.env.CHROME_DEVEL_SANDBOX = process.env.CHROME_BIN + '_sandbox';

const jasmineSeedReporter = require('./jasmine-seed-reporter.js');

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-mocha-reporter'),
      require('karma-chrome-launcher'),
      require('@angular-devkit/build-angular/plugins/karma'),
      jasmineSeedReporter
    ],
    client: {
      jasmine: {
        random: true
        // seed: 70043
      },
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    reporters: ['mocha', 'jasmine-seed'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeHeadless'],
    singleRun: false
  });
};
