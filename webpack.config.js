/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const webpack = require('webpack');

const ensureArray = (config) => config && (Array.isArray(config) ? config : [config]) || [];
const when = (condition, config, negativeConfig) =>
  condition ? ensureArray(config) : ensureArray(negativeConfig);

const cssLoader = 'css-loader';

const sassLoader = {
  loader: 'sass-loader',
  options: {
    sassOptions: {
      includePaths: ['node_modules']
    }
  }
};

const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    postcssOptions: {
      plugins: ['autoprefixer']
    }
  }
};

module.exports = function (env, { analyze }) {
  const production = env.production || process.env.NODE_ENV === 'production';
  return {
    target: 'web',
    mode: production ? 'production' : 'development',
    devtool: production ? undefined : 'eval-cheap-source-map',
    entry: {
      entry: './src/main.ts'
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: production ? '[name].[contenthash].bundle.js' : '[name].bundle.js'
    },
    resolve: {
      extensions: ['.ts', '.js', '.json', '.html'],
      modules: [path.resolve(__dirname, 'src'), 'node_modules']
    },
    devServer: {
      historyApiFallback: true,
      open: !process.env.CI,
      port: 9000,
      client: {
        overlay: {
          warnings: false,
          errors: true
        }
      }
    },
    module: {
      rules: [
        { test: /\.(woff|woff2|ttf|eot|svg|otf|png|gif|jpg|cur)(\?v=[0-9]\.[0-9]\.[0-9])?$/i, type: 'asset' },
        { test: /\.css$/i, use: ['style-loader', cssLoader, postcssLoader] },
        { test: /\.scss$/i, use: ['style-loader', cssLoader, postcssLoader, sassLoader] },
        { test: /\.ts$/i, use: ['ts-loader', '@aurelia/webpack-loader'], exclude: /node_modules/ },
        { test: /@aurelia-mdc-web.*\.html$/i, use: '@aurelia/webpack-loader' },
        { test: /[/\\]src[/\\].+\.html$/i, use: '@aurelia/webpack-loader', exclude: /node_modules/ }
      ]
    },
    plugins: [
      ...when(production, new webpack.NormalModuleReplacementPlugin(/config-dev/gi, (resource) => {
        resource.request = resource.request.replace(/config-dev/, 'config-prod');
      })),
      new HtmlWebpackPlugin({ template: 'index.html' }),
      analyze && new BundleAnalyzerPlugin()
    ].filter(p => p)
  }
}
