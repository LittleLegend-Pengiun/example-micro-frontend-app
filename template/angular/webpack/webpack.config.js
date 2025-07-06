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