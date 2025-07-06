#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const { execSync } = require("child_process");
const { v4: uuidv4 } = require("uuid");

const questions = [
  {
    type: "input",
    name: "framework",
    message: "Select the framework you want to use:",
    default: "react",
    validate: (input) => {
      if (input !== "react" && input !== "vue" && input !== "angular") {
        return "Invalid framework. Please select from react, vue, or angular.";
      }
      return true;
    },
  },
  {
    type: "input",
    name: "appName",
    message: "Enter the name of your mini-app:",
    default: "mini_app_example",
    validate: (input) => {
      if (input.includes("-")) {
        return "App name must use underscores (_) instead of hyphens (-). This is a requirement of Webpack Module Federation.";
      }
      if (!/^[a-z0-9_]+$/.test(input)) {
        return "App name can only contain lowercase letters, numbers, and underscores.";
      }
      return true;
    },
    filter: (input) => input.toLowerCase().replace(/-/g, "_"),
  },
  {
    type: "input",
    name: "exposeKey",
    message: "Enter the expose key (e.g., mount):",
    default: "mount",
  },
  {
    type: "input",
    name: "exposeValue",
    message: (answers) => {
      if (answers.framework === "angular") {
        return "Expose value (auto-generated UUID, press Enter to accept):";
      }
      return "Enter the expose value (e.g., ./bootstrap):";
    },
    default: (answers) => {
      if (answers.framework === "angular") {
        return `bootstrap_${uuidv4().replace(/-/g, "_")}`;
      }
      return "./bootstrap";
    },
  },
  {
    type: "input",
    name: "port",
    message: "Enter the port number:",
    default: "3000",
    validate: (input) => {
      const port = parseInt(input);
      if (isNaN(port) || port < 1 || port > 65535) {
        return "Please enter a valid port number (1-65535)";
      }
      return true;
    },
  },
];

async function generateMiniApp() {
  try {
    const answers = await inquirer.prompt(questions);

    if (answers.framework === "angular") {
      // Create app directory
      const appDir = path.join(process.cwd(), answers.appName);
      if (!fs.existsSync(appDir)) {
        fs.mkdirSync(appDir, { recursive: true });
      }
      // Get template directory from package
      const templateDir = path.join(
        __dirname,
        "..",
        "..",
        "template",
        answers.framework
      );
      copyDir(templateDir, appDir);

      // Update package.json
      const packageJsonPath = path.join(appDir, "package.json");
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
      packageJson.name = answers.appName;
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

      // Update webpack.config.js
      const webpackConfigPath = path.join(
        appDir,
        "webpack",
        "webpack.config.js"
      );
      let webpackConfig = fs.readFileSync(webpackConfigPath, "utf8");

      let newWebpackConfig = `module.exports = withModuleFederationPlugin({
  name: "${answers.appName}",
  filename: "remoteEntry.js",
  remotes: {},
  exposes: {
    "./${answers.exposeKey}": "./src/${answers.exposeValue}",
  },

  shared: share({
    "@angular/core": { requiredVersion: "auto" },
    "@angular/common": { requiredVersion: "auto" },
    "@angular/router": { requiredVersion: "auto" },
    rxjs: { requiredVersion: "auto" },
  }),
});`;

      webpackConfig = webpackConfig.replace(
        /module.exports = withModuleFederationPlugin\({[\s\S]*?}\);/,
        newWebpackConfig
      );

      fs.writeFileSync(webpackConfigPath, webpackConfig);

      // update angular.json port
      const angularJsonPath = path.join(appDir, "angular.json");
      let angularJson = fs.readFileSync(angularJsonPath, "utf8");
      angularJson = angularJson.replace(
        /"port": \d+,/,
        `"port": ${answers.port},`
      );
      angularJson = angularJson.replace(
        /"publicHost": "http:\/\/localhost:\d+",/,
        `"publicHost": "http://localhost:${answers.port}",`
      );
      fs.writeFileSync(angularJsonPath, angularJson);

      // generate unique app-root
      const uniqueId = `app-root-${uuidv4()}`;

      // update index.html
      const indexHtmlPath = path.join(appDir, "src", "index.html");
      let indexHtml = fs.readFileSync(indexHtmlPath, "utf8");
      indexHtml = indexHtml.replace(/app-root/, uniqueId);
      fs.writeFileSync(indexHtmlPath, indexHtml);

      // update bootstrap.ts
      const oldBootstrapPath = path.join(appDir, "src", "bootstrap.ts");
      const bootstrapPath = path.join(
        appDir,
        "src",
        `${answers.exposeValue}.ts`
      );

      let bootstrap = fs.readFileSync(oldBootstrapPath, "utf8");

      fs.renameSync(oldBootstrapPath, bootstrapPath);

      bootstrap = bootstrap.replaceAll("app-root", uniqueId);
      bootstrap = bootstrap.replaceAll(
        "angular-element",
        `${answers.appName}-element`
      );
      fs.writeFileSync(bootstrapPath, bootstrap);

      // update app.component.ts
      const appComponentPath = path.join(
        appDir,
        "src",
        "app",
        "app.component.ts"
      );
      let appComponent = fs.readFileSync(appComponentPath, "utf8");
      appComponent = appComponent.replaceAll(
        "angular-element",
        `${answers.appName}-element`
      );
      fs.writeFileSync(appComponentPath, appComponent);

      // update app.module.ts
      const appModulePath = path.join(appDir, "src", "app", "app.module.ts");
      let appModule = fs.readFileSync(appModulePath, "utf8");
      appModule = appModule.replaceAll(
        "angular-element",
        `${answers.appName}-element`
      );
      fs.writeFileSync(appModulePath, appModule);

      // update main.ts
      const mainPath = path.join(appDir, "src", "main.ts");
      let main = fs.readFileSync(mainPath, "utf8");
      main = main.replaceAll("./bootstrap", `./${answers.exposeValue}`);
      fs.writeFileSync(mainPath, main);

      console.log("\n🎉 Mini-app generated successfully!");
      console.log(`\nTo get started:
    cd ${answers.appName}
    npm install
    ng build microfrontend-loader
    npm start
    `);
    } else {
      // Create app directory
      const appDir = path.join(process.cwd(), answers.appName);
      if (!fs.existsSync(appDir)) {
        fs.mkdirSync(appDir, { recursive: true });
      }

      // Get template directory from package
      const templateDir = path.join(
        __dirname,
        "..",
        "..",
        "template",
        answers.framework
      );
      copyDir(templateDir, appDir);

      // Update package.json
      const packageJsonPath = path.join(appDir, "package.json");
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
      packageJson.name = answers.appName;
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

      // Update webpack.config.js
      const webpackConfigPath = path.join(
        appDir,
        "webpack",
        "webpack.config.js"
      );
      let webpackConfig = fs.readFileSync(webpackConfigPath, "utf8");

      // Update port
      webpackConfig = webpackConfig.replace(
        /port: \d+,/,
        `port: ${answers.port},`
      );

      // Update ModuleFederationPlugin configuration
      const moduleFederationConfig = `
    new ModuleFederationPlugin({
      name: "${answers.appName}",
      filename: "remoteEntry.js",
      exposes: {
        "./${answers.exposeKey}": "${answers.exposeValue}"
      },
      shared: { react: { singleton: true }, "react-dom": { singleton: true } },
    }),`;

      webpackConfig = webpackConfig.replace(
        /new ModuleFederationPlugin\({[\s\S]*?}\),/,
        moduleFederationConfig
      );

      fs.writeFileSync(webpackConfigPath, webpackConfig);

      // Generate unique ID
      const uniqueId = `${answers.appName}-root-${uuidv4()}`;

      // Update index.html with unique ID
      const indexHtmlPath = path.join(appDir, "public", "index.html");
      let indexHtml = fs.readFileSync(indexHtmlPath, "utf8");
      indexHtml = indexHtml.replace(/id="root"/, `id="${uniqueId}"`);
      fs.writeFileSync(indexHtmlPath, indexHtml);

      // Update bootstrap.jsx with unique ID
      const bootstrapPath = path.join(
        appDir,
        answers.framework === "react" ? "bootstrap.jsx" : "bootstrap.js"
      );
      let bootstrap = fs.readFileSync(bootstrapPath, "utf8");
      bootstrap = bootstrap.replace(
        /getElementById\("root"\)/,
        `getElementById("${uniqueId}")`
      );
      fs.writeFileSync(bootstrapPath, bootstrap);

      console.log("\n🎉 Mini-app generated successfully!");
      console.log(`\nTo get started:
    cd ${answers.appName}
    npm install
    npm start
    `);
    }
  } catch (error) {
    console.error("Error generating mini-app:", error);
    process.exit(1);
  }
}

function copyDir(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

generateMiniApp();
