const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
   entry: {
      bundle: './assets/js/bundle.js'
   },
   output: {
      filename: '[name]-min.js',
      path: path.resolve(__dirname, 'assets/js'),
      clean: false
   },
   optimization: {
      minimize: true,
      minimizer: [new TerserPlugin()]
   },
   resolve: {
      modules: ['node_modules']
   }
};
