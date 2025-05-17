const fs = require("fs");
const path = require("path");

/**
 * Recursively copies a directory and its contents to a destination directory
 * @param {string} source - The source directory path to copy from
 * @param {string} destination - The destination directory path to copy to
 * @throws {Error} If there's an error during the copy process
 * @example
 * // Copy all files from template/miniapps to miniapps/miniapp3
 * copyDirectory('./template/miniapps', './miniapps/miniapp3');
 */
function copyDirectory(source, destination) {
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  // Read source directory
  const entries = fs.readdirSync(source, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const destPath = path.join(destination, entry.name);

    if (entry.isDirectory()) {
      // Recursively copy subdirectories
      copyDirectory(sourcePath, destPath);
    } else {
      // Copy files
      fs.copyFileSync(sourcePath, destPath);
    }
  }
}

/**
 * Updates the exportConfig.json file with new module federation configuration
 * @param {string} destDir - The directory containing the exportConfig.json file
 * @param {Object} [updates] - Optional updates to apply to the configuration
 * @param {Object} [updates.exposes] - Module federation exposes configuration
 * @param {string} [updates.name] - Module federation name
 * @returns {void}
 * @throws {Error} If there's an error reading or writing the config file
 * @example
 * // Update just the exposes field
 * updateExportConfig('./miniapps/miniapp3', {
 *   exposes: { "./mount": "./bootstrap" }
 * });
 */
function updateExportConfig(destDir, updates = {}) {
  const configPath = path.join(destDir, "exportConfig.json");

  try {
    // Read the JSON file
    const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

    // Update the configuration with provided updates or default
    config.webpackModuleFederation = {
      ...config.webpackModuleFederation,
      ...updates,
      exposes: updates.exposes || { "./mount": "./bootstrap" },
    };

    // Write back to file with proper formatting
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log("Successfully updated exportConfig.json");
  } catch (error) {
    console.error("Error updating exportConfig.json:", error);
    throw error; // Re-throw to handle in the main try-catch
  }
}

// Usage
const sourceDir = path.join(__dirname, "template", "miniapps");
const destDir = path.join(__dirname, "miniapps", "miniapp3");

try {
  // First copy all files
  copyDirectory(sourceDir, destDir);
  console.log(
    "Successfully copied all files from template/miniapps to miniapps/miniapp3"
  );

  // Then update the exportConfig.json
  updateExportConfig(destDir);
} catch (error) {
  console.error("Error in the process:", error);
}
