const {
  share,
  withModuleFederationPlugin,
} = require("@angular-architects/module-federation/webpack");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = withModuleFederationPlugin({
  name: "angularApp",
  filename: "remoteEntry.js",
  remotes: {},
  exposes: {
    "./mount": "./src/bootstrap.ts",
  },

  shared: share({
    "@angular/core": { requiredVersion: "auto" },
    "@angular/common": { requiredVersion: "auto" },
    "@angular/router": { requiredVersion: "auto" },
    rxjs: { requiredVersion: "auto" },
  }),
});

// module.exports = {
//   entry: "./src/bootstrap.ts",
//   mode: "development",
//   devServer: {
//     port: 4200,
//     historyApiFallback: true,
//   },
//   output: {
//     publicPath: "auto",
//     clean: true,
//   },
//   resolve: {
//     extensions: [".ts", ".js", ".html"],
//   },
//   module: {
//     rules: [
//       { test: /\.ts$/, loader: "ts-loader" },
//       { test: /\.html$/, loader: "html-loader" },
//     ],
//   },
//   plugins: [
//     new ModuleFederationPlugin({
//       name: "angularApp",
//       remotes: {},
//       filename: "remoteEntry.js",
//       exposes: {
//         "./mount": "./src/bootstrap.ts",
//       },
//       shared: {},
//     }),
//   ],
// };
