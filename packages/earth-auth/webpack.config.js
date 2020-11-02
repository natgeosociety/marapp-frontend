const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

const Dotenv = require('dotenv-webpack');

const ACTIVE_ENV = process.env.NODE_ENV === 'production' ? '.env' : '.env.local';

require('dotenv').config({path: ACTIVE_ENV});

module.exports = {
  mode: 'production',
  entry: {
    signin: './src/Signin.ts',
    passReset: './src/PasswordReset.ts',
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 8000
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
    'auth0-lock': 'Auth0Lock',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          {loader: 'style-loader', options: {injectType: 'styleTag'}},
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(jpe?g|png|ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        use: 'base64-inline-loader?limit=1000&name=[name].[ext]',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inlineSource: '.(js|css)$',
      template: __dirname + '/src/signin.html',
      filename: 'signin.html',
      inject: 'body',
      title: process.env.APP_NAME,
      chunk: ['Signin.ts'],
    }),
    new HtmlWebpackPlugin({
      inlineSource: '.(js|css)$',
      template: __dirname + '/src/password-reset.html',
      filename: 'password-reset.html',
      inject: 'body',
      title: process.env.APP_NAME,
      chunk: ['PasswordReset.ts'],
    }),
    new HtmlWebpackInlineSourcePlugin(),
    new Dotenv({
      path: ACTIVE_ENV,
    }),
  ],
};
