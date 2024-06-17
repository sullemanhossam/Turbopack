const fs = require("fs").promises;
const { exec } = require("child_process");

async function createAndInstallPackages() {
  try {
    // Check if packages/heroicons-v1 directory exists
    if (!(await directoryExists("packages/heroicons-v1"))) {
      await fs.mkdir("packages/heroicons-v1", { recursive: true });
      console.log("Created directory: packages/heroicons-v1");
      process.chdir("packages/heroicons-v1");
      await installPackage("@heroicons/react@1.0.0");
    } else {
      console.log("Directory already exists: packages/heroicons-v1");
    }

    // Check if packages/heroicons-v2 directory exists
    if (!(await directoryExists("packages/heroicons-v2"))) {
      await fs.mkdir("packages/heroicons-v2", { recursive: true });
      console.log("Created directory: packages/heroicons-v2");
      process.chdir("packages/heroicons-v2");
      await installPackage("@heroicons/react@2.0.0");
    } else {
      console.log("Directory already exists: packages/heroicons-v2");
    }

    console.log("Installation completed successfully.");
  } catch (error) {
    console.error("Error during installation:", error);
  }
}

async function directoryExists(path) {
  try {
    await fs.access(path);
    return true;
  } catch (error) {
    return false;
  }
}

async function installPackage(packageName) {
  // Replace with your actual package installation logic using yarn
  console.log(`Installing package ${packageName} using yarn`);

  exec(`yarn add ${packageName}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error installing package ${packageName}: ${error}`);
      return;
    }
    console.log(`Installed package ${packageName}`);
  });
}

// Call the function to execute the script
createAndInstallPackages();
