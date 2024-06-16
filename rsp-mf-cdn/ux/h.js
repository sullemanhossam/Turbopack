// // // // const path = require('path');
// // // // const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// // // // const HtmlWebpackPlugin = require('html-webpack-plugin');
// // // // const { VueLoaderPlugin } = require('vue-loader');
// // // // const { ModuleFederationPlugin } = require('webpack').container;

// // // // module.exports = (env = {}) => ({
// // // //   mode: 'development',
// // // //   cache: false,
// // // //   devtool: 'source-map',
// // // //   optimization: {
// // // //     minimize: false,
// // // //   },
// // // //   entry: path.resolve(__dirname, './src/index.ts'),
// // // //   output: {
// // // //     publicPath: 'auto',
// // // //   },
// // // //   resolve: {
// // // //     extensions: ['.vue', '.jsx', '.js', '.json'],
// // // //     alias: {
// // // //       vue$: 'vue/dist/vue.common.js',
// // // //     },
// // // //   },
// // // //   module: {
// // // //     rules: [
// // // //       {
// // // //         test: /\.vue$/,
// // // //         use: 'vue-loader',
// // // //       },
// // // //       {
// // // //         test: /\.scss$/,
// // // //         use: [
// // // //           {
// // // //             loader: MiniCssExtractPlugin.loader,
// // // //             options: {},
// // // //           },
// // // //           'css-loader',
// // // //           'sass-loader',
// // // //         ],
// // // //       },
// // // //       {
// // // //         test: /\.css$/,
// // // //         use: [
// // // //           {
// // // //             loader: MiniCssExtractPlugin.loader,
// // // //             options: {},
// // // //           },
// // // //           'css-loader',
// // // //         ],
// // // //       },
// // // //     ],
// // // //   },
// // // //   plugins: [
// // // //     new VueLoaderPlugin(),
// // // //     new MiniCssExtractPlugin({
// // // //       filename: '[name].css',
// // // //     }),
// // // //     new ModuleFederationPlugin({
// // // //       name: 'vue2App',
// // // //       filename: 'remoteEntry.js',
// // // //       library: { type: 'var', name: 'vue2App' },
// // // //       exposes: {
// // // //         './vue2': './node_modules/vue/dist/vue',
// // // //         './Button': './src/components/Button',
// // // //       },
// // // //     }),
// // // //     new HtmlWebpackPlugin({
// // // //       template: path.resolve(__dirname, './index.html'),
// // // //     }),
// // // //   ],
// // // //   devServer: {
// // // //     static: {
// // // //       directory: path.join(__dirname),
// // // //     },
// // // //     compress: true,
// // // //     port: 3001,
// // // //     hot: true,
// // // //     headers: {
// // // //       'Access-Control-Allow-Origin': '*',
// // // //       'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
// // // //       'Access-Control-Allow-Headers':
// // // //         'X-Requested-With, content-type, Authorization',
// // // //     },
// // // //   },
// // // // });

// // // const path = require('path');
// // // const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// // // const HtmlWebpackPlugin = require('html-webpack-plugin');
// // // const { VueLoaderPlugin } = require('vue-loader');
// // // const { ModuleFederationPlugin } = require('webpack').container;

// // // module.exports = (env = {}) => ({
// // //   mode: 'development',
// // //   cache: {
// // //     type: 'filesystem',
// // //   },
// // //   devtool: 'source-map',
// // //   optimization: {
// // //     minimize: false,
// // //   },
// // //   entry: {
// // //     main: path.resolve(__dirname, 'src/index.ts'),
// // //   },
// // //   output: {
// // //     path: path.resolve(__dirname, 'dist'),
// // //     publicPath: 'http://localhost:3001/',
// // //     filename: '[name].js',
// // //     chunkFilename: '[id].js',
// // //   },
// // //   resolve: {
// // //     extensions: ['.vue', '.jsx', '.js', '.json'],
// // //     alias: {
// // //       vue$: 'vue/dist/vue.common.js',
// // //     },
// // //   },
// // //   module: {
// // //     rules: [
// // //       {
// // //         test: /\.vue$/,
// // //         loader: 'vue-loader',
// // //       },
// // //       {
// // //         test: /\.scss$/,
// // //         use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
// // //       },
// // //       {
// // //         test: /\.css$/,
// // //         use: [MiniCssExtractPlugin.loader, 'css-loader'],
// // //       },
// // //       {
// // //         test: /\.tsx?$/,
// // //         exclude: /node_modules/,
// // //         use: 'ts-loader',
// // //       },
// // //     ],
// // //   },
// // //   plugins: [
// // //     new VueLoaderPlugin(),
// // //     new MiniCssExtractPlugin({
// // //       filename: '[name].css',
// // //     }),
// // //     new ModuleFederationPlugin({
// // //       name: 'vue2App',
// // //       filename: 'remoteEntry.js',
// // //       exposes: {
// // //         './vue2': './node_modules/vue/dist/vue',
// // //         './Button': './src/components/Button',
// // //       },
// // //       shared: {
// // //         vue: {
// // //           singleton: true,
// // //           requiredVersion: '^2.6.14',
// // //         },
// // //       },
// // //     }),
// // //     new HtmlWebpackPlugin({
// // //       template: path.resolve(__dirname, 'index.html'),
// // //     }),
// // //   ],
// // //   devServer: {
// // //     static: {
// // //       directory: path.join(__dirname),
// // //     },
// // //     compress: true,
// // //     port: 3001,
// // //     hot: true,
// // //     headers: {
// // //       'Access-Control-Allow-Origin': '*',
// // //       'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
// // //       'Access-Control-Allow-Headers':
// // //         'X-Requested-With, content-type, Authorization',
// // //     },
// // //   },
// // // });

// // const path = require('path');
// // const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// // const HtmlWebpackPlugin = require('html-webpack-plugin');
// // const { VueLoaderPlugin } = require('vue-loader');
// // const { ModuleFederationPlugin } = require('webpack').container;

// // module.exports = (env = {}) => ({
// //   mode: 'development',
// //   cache: {
// //     type: 'filesystem',
// //   },
// //   devtool: 'source-map',
// //   optimization: {
// //     minimize: false,
// //   },
// //   entry: {
// //     main: path.resolve(__dirname, 'src/index.ts'),
// //   },
// //   output: {
// //     path: path.resolve(__dirname, 'dist'),
// //     publicPath: 'http://localhost:3001/',
// //     filename: '[name].js',
// //     chunkFilename: '[id].js',
// //   },
// //   resolve: {
// //     extensions: ['.vue', '.js', '.json', '.ts', '.tsx'],
// //     alias: {
// //       vue$: 'vue/dist/vue.esm.js',
// //       '@': path.resolve(__dirname, 'src'),
// //     },
// //   },
// //   module: {
// //     rules: [
// //       {
// //         test: /\.vue$/,
// //         loader: 'vue-loader',
// //       },
// //       {
// //         test: /\.scss$/,
// //         use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
// //       },
// //       {
// //         test: /\.css$/,
// //         use: [MiniCssExtractPlugin.loader, 'css-loader'],
// //       },
// //       {
// //         test: /\.tsx?$/,
// //         exclude: /node_modules/,
// //         use: 'ts-loader',
// //       },
// //     ],
// //   },
// //   plugins: [
// //     new VueLoaderPlugin(),
// //     new MiniCssExtractPlugin({
// //       filename: '[name].css',
// //     }),
// //     new ModuleFederationPlugin({
// //       name: 'vue2App',
// //       filename: 'remoteEntry.js',
// //       exposes: {
// //         './vue2': './node_modules/vue/dist/vue.esm.js',
// //         './Button': './src/components/Button',
// //       },
// //       shared: {
// //         vue: {
// //           singleton: true,
// //           requiredVersion: '^2.6.14',
// //         },
// //       },
// //     }),
// //     new HtmlWebpackPlugin({
// //       template: path.resolve(__dirname, 'index.html'),
// //     }),
// //   ],
// //   devServer: {
// //     static: {
// //       directory: path.join(__dirname),
// //     },
// //     compress: true,
// //     port: 3001,
// //     hot: true,
// //     headers: {
// //       'Access-Control-Allow-Origin': '*',
// //       'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
// //       'Access-Control-Allow-Headers':
// //         'X-Requested-With, content-type, Authorization',
// //     },
// //   },
// // });

// const path = require('path');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const { VueLoaderPlugin } = require('vue-loader');
// const { ModuleFederationPlugin } = require('webpack').container;

// module.exports = (env = {}) => ({
//   mode: 'development',
//   cache: {
//     type: 'filesystem',
//   },
//   devtool: 'source-map',
//   optimization: {
//     minimize: false,
//   },
//   entry: {
//     main: path.resolve(__dirname, 'src', 'index.ts'),
//   },
//   output: {
//     path: path.resolve(__dirname, 'dist'),
//     publicPath: '/',
//     filename: '[name].js',
//     chunkFilename: '[id].js',
//   },
//   resolve: {
//     extensions: ['.vue', '.js', '.json', '.ts', '.tsx'],
//     alias: {
//       vue$: 'vue/dist/vue.esm.js',
//       '@': path.resolve(__dirname, 'src'),
//     },
//   },
//   module: {
//     rules: [
//       {
//         test: /\.vue$/,
//         loader: 'vue-loader',
//       },
//       {
//         test: /\.scss$/,
//         use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
//       },
//       {
//         test: /\.css$/,
//         use: [MiniCssExtractPlugin.loader, 'css-loader'],
//       },
//       {
//         test: /\.tsx?$/,
//         exclude: /node_modules/,
//         use: 'ts-loader',
//       },
//     ],
//   },
//   plugins: [
//     new VueLoaderPlugin(),
//     new MiniCssExtractPlugin({
//       filename: '[name].css',
//     }),
//     new ModuleFederationPlugin({
//       name: 'vue2App',
//       filename: 'remoteEntry.js',
//       exposes: {
//         './vue2': 'vue/dist/vue.common.js', // Expose Vue 2
//         './Button': './src/components/Button.vue', // Example component
//       },
//       shared: {
//         vue: {
//           singleton: true,
//           requiredVersion: '^2.6.14',
//         },
//       },
//     }),
//     new HtmlWebpackPlugin({
//       template: path.resolve(__dirname, 'index.html'),
//     }),
//   ],
//   devServer: {
//     static: {
//       directory: path.join(__dirname),
//     },
//     compress: true,
//     port: 3001,
//     hot: true,
//     headers: {
//       'Access-Control-Allow-Origin': '*',
//       'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
//       'Access-Control-Allow-Headers':
//         'X-Requested-With, content-type, Authorization',
//     },
//   },
// });
// åå

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const { ModuleFederationPlugin } = require('webpack').container;
module.exports = (env = {}) => ({
  mode: 'development',
  cache: false,
  devtool: 'source-map',
  optimization: {
    minimize: false,
  },
  entry: path.resolve(__dirname, './src/main.js'),
  output: {
    publicPath: 'auto',
  },
  resolve: {
    extensions: ['.vue', '.jsx', '.js', '.json'],
    alias: {
      vue$: 'vue/dist/vue.common.js',
    },
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader',
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {},
          },
          'css-loader',
        ],
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new ModuleFederationPlugin({
      name: 'vue2App',
      filename: 'remoteEntry.js',
      library: { type: 'var', name: 'vue2App' },
      exposes: {
        './vue2': './node_modules/vue/dist/vue',
        // './Button': './src/components/Button',
      },
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './index.html'),
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname),
    },
    compress: true,
    port: 3001,
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers':
        'X-Requested-With, content-type, Authorization',
    },
  },
});
