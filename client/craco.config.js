const path = require("path");

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // Suppress source map warnings for third-party libraries
      webpackConfig.module.rules.push({
        test: /\.js$/,
        enforce: "pre",
        use: ["source-map-loader"],
        exclude: [
          // Exclude problematic packages from source map processing
          /node_modules\/html2pdf\.js/,
          /node_modules\/jspdf/,
          /node_modules\/html2canvas/,
        ],
      });

      // Also suppress warnings in existing source-map-loader rules
      webpackConfig.module.rules.forEach((rule) => {
        if (rule.use) {
          rule.use.forEach((use) => {
            if (use.loader && use.loader.includes('source-map-loader')) {
              use.options = use.options || {};
              use.options.filterSourceMappingUrl = (url, resourcePath) => {
                // Suppress warnings for html2pdf.js and other problematic packages
                if (resourcePath.includes('html2pdf.js') || 
                    resourcePath.includes('html2pdf') ||
                    resourcePath.includes('es6-promise.map')) {
                  return false;
                }
                return true;
              };
            }
          });
        }
      });

      // Remove existing source-map-loader rules that might cause issues
      webpackConfig.module.rules = webpackConfig.module.rules.filter((rule) => {
        if (rule.enforce === 'pre' && rule.use) {
          const hasSourceMapLoader = rule.use.some((use) => 
            typeof use === 'string' ? use.includes('source-map-loader') : 
            use.loader && use.loader.includes('source-map-loader')
          );
          return !hasSourceMapLoader;
        }
        return true;
      });

      return webpackConfig;
    },
  },
};