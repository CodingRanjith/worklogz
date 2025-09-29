const path = require("path");

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // Suppress source map warnings for third-party libraries
      webpackConfig.module.rules.forEach((rule) => {
        if (rule.use) {
          rule.use.forEach((use) => {
            if (use.loader && use.loader.includes('source-map-loader')) {
              use.options = use.options || {};
              use.options.filterSourceMappingUrl = (url, resourcePath) => {
                // Suppress warnings for html2pdf.js and other problematic packages
                if (resourcePath.includes('html2pdf.js') || 
                    resourcePath.includes('node_modules')) {
                  return false;
                }
                return true;
              };
            }
          });
        }
      });

      return webpackConfig;
    },
  },
};