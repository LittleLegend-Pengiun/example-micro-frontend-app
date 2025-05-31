#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const { execSync } = require("child_process");
const { v4: uuidv4 } = require("uuid");

const questions = [
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
    message: "Enter the expose value (e.g., ./bootstrap):",
    default: "./bootstrap",
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

    // Create app directory
    const appDir = path.join(process.cwd(), answers.appName);
    if (!fs.existsSync(appDir)) {
      fs.mkdirSync(appDir, { recursive: true });
    }

    // Get template directory from package
    const templateDir = path.join(__dirname, "..", "..", "template", "react");
    copyDir(templateDir, appDir);

    // Update package.json
    const packageJsonPath = path.join(appDir, "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    packageJson.name = answers.appName;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

    // Update webpack.config.js
    const webpackConfigPath = path.join(appDir, "webpack", "webpack.config.js");
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
    const bootstrapPath = path.join(appDir, "bootstrap.jsx");
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
