module.exports = {
  testEnvironment: 'node',
  reporters: [
    'default',
    [
      'jest-html-reporter',
      {
        pageTitle: 'API Test Report',
        outputPath: 'reports/report.html',
        includeFailureMsg: true,
        includeConsoleLog: true
      }
    ]
  ],
  testTimeout: 30000
};
