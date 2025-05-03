const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const exportConfig = require("../exportConfig.json");

module.exports = {
  entry: exportConfig.entry,
  mode: "development",
  devServer: {
    port: exportConfig.port,
  },
  output: {
    publicPath: "auto",
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  plugins: [
    new ModuleFederationPlugin(exportConfig.webpackModuleFederation),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};
