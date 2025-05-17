const fs = require("fs");
const path = require("path");

function updatePackageJson(destDir, updateConfig) {
  const packageJsonPath = path.join(destDir, "package.json");
  const { name } = updateConfig;

  try {
    // Read the JSON file
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

    // Update the fields
    packageJson.name = name;

    // Write back to file with proper formatting
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log("Successfully updated package.json");
  } catch (error) {
    console.error("Error updating package.json:", error);
  }
}

module.exports = {
  updatePackageJson,
};
