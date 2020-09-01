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
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
      jasmineSeedReporter
    ],
    files: [
      {
        type: 'js',
        watched: false,
        pattern:
          'https://maps.googleapis.com/maps/api/js?key=AIzaSyAHJkTceJjbwCjpkd3RV7ehC8J2Huuj2I0&libraries=places'
      },
      { type: 'js', watched: false, pattern: 'src/app/shared/tests/google.mock.js' }
    ],
    client: {
      jasmine: {
        random: true,
        timeoutInterval: 10000
        // seed: 36124
      },
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, '../coverage/campus-cloud'),
      reports: ['html', 'lcovonly', 'text-summary'],
      fixWebpackSourcePaths: true,
      combineBrowserReports: true,
      thresholds: {
        emitWarning: false,
        global: {
          statements: 54.2,
          branches: 36.5, // TODO increase one percent
          functions: 41.5,
          lines: 54.2
        }
      }
    },
    browserDisconnectTolerance: 2,
    browserDisconnectTimeout: 10000,
    reporters: ['mocha', 'jasmine-seed'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeHeadless'],
    singleRun: false
  });
};
