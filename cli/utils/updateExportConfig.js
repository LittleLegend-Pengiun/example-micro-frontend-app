const fs = require("fs");
const path = require("path");

function updateExportConfig(destDir, updateConfig) {
  const configPath = path.join(destDir, "exportConfig.json");
  const { name, filename, port, exposeKey } = updateConfig;

  try {
    // Read the JSON file
    const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

    // Update the fields
    config.webpackModuleFederation.exposes = {
      [exposeKey]: "./bootstrap",
    };
    config.webpackModuleFederation.name = name;
    config.webpackModuleFederation.filename = filename;

    // Update expose port
    config.port = port;

    // Write back to file with proper formatting
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log("Successfully updated exportConfig.json");
  } catch (error) {
    console.error("Error updating exportConfig.json:", error);
  }
}

module.exports = {
  updateExportConfig,
};
