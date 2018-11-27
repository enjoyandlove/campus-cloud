// Helper: root() is defined at the bottom
const path = require('path');
const webpack = require('webpack');

// Webpack Plugins
const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

/**
 * Env
 * Get npm lifecycle event to identify the environment
 */
var ENV = process.env.npm_lifecycle_event;
var isTestWatch = ENV === 'test-watch';
var isTest = ENV === 'test' || isTestWatch;

var isProd =
  ENV === 'staging' ||
  ENV === 'production-usa' ||
  ENV === 'production-sea' ||
  ENV === 'production-canada';

module.exports = (function makeWebpackConfig() {
  /**
   * Config
   * Reference: http://webpack.github.io/docs/configuration.html
   * This is the object where all configuration gets set
   */
  var config = {};

  /**
   * Devtool
   * Reference: http://webpack.github.io/docs/configuration.html#devtool
   * Type of sourcemap to use per build type
   */
  if (isProd) {
    config.devtool = 'source-map';
  } else if (isTest) {
    config.devtool = false;
  } else {
    config.devtool = 'eval-source-map';
  }

  /**
   * Entry
   * Reference: http://webpack.github.io/docs/configuration.html#entry
   */
  if (!isTest) {
    config.entry = isTest
      ? {}
      : {
          polyfills: './client/polyfills.ts',
          vendor: './client/vendor.ts',
          app: './client/main.ts' // our angular app
        };
  }

  /**
   * Output
   * Reference: http://webpack.github.io/docs/configuration.html#output
   */
  config.output = isTest
    ? {}
    : {
        path: root('_dist'),
        publicPath: isProd ? '/dist/' : 'http://localhost:3030/',
        filename: isProd ? 'js/[name].[chunkhash].js' : 'js/[name].js',
        chunkFilename: isProd ? 'js/[id].[chunkhash].chunk.js' : '[id].chunk.js'
      };

  /**
   * Resolve
   * Reference: http://webpack.github.io/docs/configuration.html#resolve
   */
  config.resolve = {
    // only discover files that have those extensions
    extensions: ['.ts', '.js', '.json', '.css', '.scss', '.html'],
    alias: {
      root: path.join(__dirname, 'client'),
      public: path.resolve(__dirname, 'client/public/'),
      styles: path.join(__dirname, 'client', 'style'),
      node_modules: path.join(__dirname, 'node_modules'),
      bootstrap: path.join(__dirname, 'node_modules', 'bootstrap', 'scss')
    }
  };

  var atlOptions = '';
  if (isTest && !isTestWatch) {
    // awesome-typescript-loader needs to output inlineSourceMap for code coverage to work with source maps.
    atlOptions = 'inlineSourceMap=true&sourceMap=false&transpileOnly=true';
  }

  /**
   * Loaders
   * Reference: http://webpack.github.io/docs/configuration.html#module-loaders
   * List: http://webpack.github.io/docs/list-of-loaders.html
   * This handles most of the magic responsible for converting modules
   */
  config.module = {
    rules: [
      // Support for .ts files.
      {
        test: /\.ts$/,
        loaders: [
          'awesome-typescript-loader?' + atlOptions,
          'angular2-template-loader',
          'angular2-router-loader',
          '@angularclass/hmr-loader'
        ],
        exclude: [isTest ? /\.(e2e)\.ts$/ : /\.(spec|e2e)\.ts$/, /node_modules\/(?!(ng2-.+))/]
      },

      // copy those assets to output
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader',

        options: {
          name: isProd ? 'assets/[name].[hash].[ext]' : '[name].[ext]'
        }
      },

      // Support for *.json files.
      { test: /\.json$/, loader: 'json-loader' },

      // Support for CSS as raw text
      // use 'null' loader in test mode (https://github.com/webpack/null-loader)
      // all css in client/style will be bundled in an external css file
      {
        test: /\.css$/,
        exclude: root('client', 'app'),
        loader: isTest
          ? 'null-loader'
          : ExtractTextPlugin.extract({
              fallback: 'style-loader',
              loader: ['css-loader', 'postcss-loader']
            })
      },
      // all css required in client/app files will be merged in js files
      {
        test: /\.css$/,
        include: root('client', 'app'),
        loader: 'raw-loader!postcss-loader'
      },

      // support for .scss files
      // use 'null' loader in test mode (https://github.com/webpack/null-loader)
      // all css in client/style will be bundled in an external css file
      {
        test: /\.(scss|sass)$/,
        exclude: root('client', 'app'),
        loader: isTest
          ? 'null-loader'
          : ExtractTextPlugin.extract({
              fallback: 'style-loader',
              loader: ['css-loader', 'postcss-loader', 'sass-loader']
            })
      },
      // all css required in client/app files will be merged in js files
      {
        test: /\.(scss|sass)$/,
        exclude: root('client', 'style'),
        loader: 'raw-loader!postcss-loader!sass-loader'
      },

      // support for .html as raw text
      // todo: change the loader to something that adds a hash to images
      {
        test: /\.html$/,
        loader: 'raw-loader',
        exclude: root('client', 'public')
      }
    ]
  };

  if (isTest && !isTestWatch) {
    // instrument only testing sources with Istanbul, covers ts files
    config.module.rules.push({
      test: /\.ts$/,
      enforce: 'post',
      include: path.resolve('client'),
      loader: 'istanbul-instrumenter-loader',
      exclude: [/\.spec\.ts$/, /\.e2e\.ts$/, /node_modules/]
    });
  }

  if (!isTest || !isTestWatch) {
    // tslint support
    config.module.rules.push({
      test: /\.ts$/,
      enforce: 'pre',
      loader: 'tslint-loader'
    });
  }

  /**
   * Plugins
   * Reference: http://webpack.github.io/docs/configuration.html#plugins
   * List: http://webpack.github.io/docs/list-of-plugins.html
   */
  config.plugins = [
    new HardSourceWebpackPlugin(),
    // new BundleAnalyzerPlugin(),
    // Define env variables to help with builds
    // Reference: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
    new webpack.DefinePlugin({
      // Environment helpers
      'process.env': {
        ENV: JSON.stringify(ENV)
      }
    }),

    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      jquery: 'jquery'
    }),

    // Workaround needed for angular 2 angular/angular#11580
    new webpack.ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      /(.+)?angular(\\|\/)core(.+)?/,
      root('./src') // location of your src
    ),

    // Tslint configuration for webpack 2
    new webpack.LoaderOptionsPlugin({
      options: {
        /**
         * Apply the tslint loader as pre/postLoader
         * Reference: https://github.com/wbuchwalter/tslint-loader
         */
        tslint: {
          emitErrors: false,
          failOnHint: false
        },
        /**
         * Sass
         * Reference: https://github.com/jtangelder/sass-loader
         * Transforms .scss files to .css
         */
        sassLoader: {
          //includePaths: [path.resolve(__dirname, "node_modules/foundation-sites/scss")]
        },
        /**
         * PostCSS
         * Reference: https://github.com/postcss/autoprefixer-core
         * Add vendor prefixes to your css
         */
        postcss: [
          autoprefixer({
            browsers: ['last 2 version']
          })
        ]
      }
    })
  ];

  if (!isTest && !isTestWatch) {
    config.plugins.push(
      // Generate common chunks if necessary
      // Reference: https://webpack.github.io/docs/code-splitting.html
      // Reference: https://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
      new CommonsChunkPlugin({
        name: ['vendor', 'polyfills']
      }),

      // Inject script and link tags into html files
      // Reference: https://github.com/ampedandwired/html-webpack-plugin
      new HtmlWebpackPlugin({
        template: './client/public/index.html',
        chunksSortMode: 'dependency',
        hash: true
      }),

      // Extract css files
      // Reference: https://github.com/webpack/extract-text-webpack-plugin
      // Disabled when in test mode or not in build mode
      new ExtractTextPlugin({
        filename: 'css/[name].[hash].css',
        disable: !isProd
      })
    );
  }

  // Add build specific plugins
  if (isProd) {
    config.plugins.push(
      // Reference: http://webpack.github.io/docs/list-of-plugins.html#NoEmitOnErrorsPlugin
      // Only emit files when there are no errors
      new webpack.NoEmitOnErrorsPlugin(),

      // // Reference: http://webpack.github.io/docs/list-of-plugins.html#dedupeplugin
      // // Dedupe modules in the output
      // new webpack.optimize.DedupePlugin(),

      // Reference: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
      // Minify all javascript, switch loaders to minimizing mode
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        drop_console: true,
        comments: false,
        mangle: { keep_fnames: true }
      }),

      // Copy assets from the public folder
      // Reference: https://github.com/kevlened/copy-webpack-plugin
      new CopyWebpackPlugin([
        {
          from: root('client/public')
        }
      ])
    );
  }

  /**
   * Dev server configuration
   * Reference: http://webpack.github.io/docs/configuration.html#devserver
   * Reference: http://webpack.github.io/docs/webpack-dev-server.html
   */
  config.devServer = {
    contentBase: './client/public',
    historyApiFallback: true,
    quiet: true,
    stats: 'minimal' // none (or false), errors-only, minimal, normal (or true) and verbose
  };

  return config;
})();

// Helper functions
function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [__dirname].concat(args));
}