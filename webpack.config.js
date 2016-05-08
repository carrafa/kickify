var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: ['./src/app.jsx'],
  output: {
    filename: './public/js/app.js',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  }

}
