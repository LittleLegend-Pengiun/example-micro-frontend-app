require("colors");
const readlineSync = require("readline-sync");
const fs = require("fs");
const path = require("path");
const { copyDirectory } = require("./utils/copyDirectory");
const { updateExportConfig } = require("./utils/updateExportConfig");
const { updatePackageJson } = require("./utils/updatePackageJson");

let name, filename, port, exposeKey;
try {
  name = readlineSync.question(
    "Enter the name of the miniapp (miniapp's scope in shell): "
  );
  filename = readlineSync.question(
    "Enter the filename of the miniapp (use in exposed url) (remoteEntry.js): "
  );
  filename = filename || "remoteEntry.js";
  port = readlineSync.question("Enter the port of the miniapp (3001): ");
  port = port || 3001;
  exposeKey = readlineSync.question(
    "Enter the exposes's key of the miniapp (./mount): "
  );
  exposeKey = exposeKey || "./mount";
} catch (error) {
  console.error(`Error input configuration`.red);
  console.error(error);
  process.exit(1);
}

console.log(`Generating miniapp ${name}...`);
const CURR_DIR = process.cwd();
const TEMPLATE_DIR = path.join(CURR_DIR, "template/miniapp");
const DEST_DIR = path.join(CURR_DIR, "miniapps", name);

if (fs.existsSync(DEST_DIR)) {
  console.log(`${DEST_DIR} already exists, please choose another name`.red);
  process.exit(1);
}

try {
  copyDirectory(TEMPLATE_DIR, DEST_DIR);
  console.log(`Miniapp ${name} generated successfully`.green);
} catch (error) {
  console.error(`Error generating miniapp ${name}`.red);
  console.error(error);
  process.exit(1);
}

updateExportConfig(DEST_DIR, { name, filename, port, exposeKey });
updatePackageJson(DEST_DIR, { name });
