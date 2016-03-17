// Karma configuration
// Generated on Wed Mar 09 2016 17:50:13 GMT+0100 (CET)

module.exports = function(config) {
  config.set({

    // basePath will be 2 levels up: we want the basePath to be the directory which has game.js and all game resources
      // as direct childing. This file will be inside node_module/sp-test-suite so that's why it is 2 levels up.
    basePath: '../../',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
        {
            pattern : '**/*.*',
            included : false,
            served : true
        },
        'node_modules/sp-test-suite/game-testsuiteSpec.js'
    ],

    // list of files to exclude
    exclude: [
        'node_modules'
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    // it would be nice if we could use PhantomJS here but that one does not provide some features (e.g. sound)
    // which are offered by all "normal" browsers.
    browsers: ['Chrome'],


    // no "Continuous Integration" mode
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
};
