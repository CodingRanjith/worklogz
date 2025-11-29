const path = require("path");

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // Suppress source map warnings for third-party libraries
      // Configure source-map-loader to exclude problematic packages
      webpackConfig.module.rules.forEach((rule) => {
        if (rule.use && Array.isArray(rule.use)) {
          rule.use.forEach((use) => {
            if (typeof use === 'object' && use.loader && use.loader.includes('source-map-loader')) {
              // Exclude html2pdf.js and related packages from source map processing
              if (!rule.exclude) {
                rule.exclude = [];
              }
              if (Array.isArray(rule.exclude)) {
                rule.exclude.push(
                  /node_modules\/html2pdf\.js/,
                  /node_modules\/es6-promise/
                );
              }
            }
          });
        }
      });

      // Suppress source map warnings globally
      if (!webpackConfig.ignoreWarnings) {
        webpackConfig.ignoreWarnings = [];
      }
      webpackConfig.ignoreWarnings.push(
        /Failed to parse source map/,
        /ENOENT: no such file or directory.*\.map/,
        /Can't resolve.*\.map/
      );

      return webpackConfig;
    },
  },
};