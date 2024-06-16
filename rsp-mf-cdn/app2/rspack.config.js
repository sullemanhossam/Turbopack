const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("@rspack/core").container;
require("dotenv").config({ path: "./.env" });
const { VueLoaderPlugin } = require("vue-loader");

const remoteUrl = "https://cdn.jsdelivr.net/gh/sullemanhossam/turbopack/temp-futr-mf/remoteLibrary/dist/remoteEntry.js";

module.exports = {
  entry: {
    main: "./src/main.js",
  },
  mode: "development",
  devServer: {
    port: 3001,
    hot: true,
    compress: true,
    watchFiles: ["src/**/*"],
  },
  target: "web",
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
    alias: {
      process: "process/browser",
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["vue-style-loader", "css-loader"],
        type: "javascript/auto",
        exclude: /node_modules/,
      },
      {
        test: /\.(scss|css)$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.ts$/, // add this rule when you use TypeScript in Vue SFC
        loader: "builtin:swc-loader",
        options: {
          jsc: {
            parser: {
              syntax: "typescript",
            },
          },
        },
        type: "javascript/auto",
      },
    ],
    experiments: {
      css: false,
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    // new VueLoaderPlugin(),
    // new rspack.HtmlRspackPlugin({
    //   template: "./public/index.html",
    // }),
    new ModuleFederationPlugin({
      name: "app2",
      remotes: {
        remoteLibrary: `remoteLibrary@${remoteUrl}`,
      },
    }),
  ],
};
