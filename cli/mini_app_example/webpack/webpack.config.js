const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
  entry: "./index.jsx",
  mode: "development",
  devServer: {
    port: 3000,
    historyApiFallback: true,
  },
  output: {
    publicPath: "auto",
    clean: true,
  },
  resolve: {
    extensions: [".js", ".jsx", ".vue"],
    alias: {
      vue: "vue/dist/vue.esm-bundler.js",
    },
  },
  module: {
    rules: [
      { test: /\.vue$/, loader: "vue-loader" },
      { test: /\.js$/, use: "babel-loader", exclude: /node_modules/ },
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
    ],
  },
  plugins: [
    
    new ModuleFederationPlugin({
      name: "mini_app_example",
      filename: "remoteEntry.js",
      exposes: {
        "./mount": "./bootstrap"
      },
      shared: { react: { singleton: true }, "react-dom": { singleton: true } },
    }),
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({ template: "./public/index.html" }),
  ],
};
