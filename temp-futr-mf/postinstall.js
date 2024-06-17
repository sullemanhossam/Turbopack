const { execSync } = require("child_process");
const path = require("path");

function executeCommand(command) {
  console.log(`Executing command: ${command}`);

  // Split command by spaces to separate command and arguments
  const parts = command.split(/\s+/);
  const cmd = parts[0];
  const args = parts.slice(1);

  try {
    const result = execSync(cmd, args, { stdio: "inherit", shell: true });

    // Check for errors
    if (result.error) {
      throw result.error;
    }

    // Check for non-zero exit code
    if (result.status !== 0) {
      throw new Error(`Command "${command}" failed with status code ${result.status}`);
    }

    console.log(`Command "${command}" executed successfully`);
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(error.message);
    process.exitCode = 1;
  }
}

//  target packages
const packagesToLink = ["heroicons-v1", "heroicons-v2"];

packagesToLink.forEach((packageName) => {
  const packagePath = path.resolve(`packages/${packageName}/node_modules`);
  const linkCommand = `yarn link ${packageName}`;
  executeCommand(`cd ${packagePath} && ${linkCommand}`);
});

// Execute use commands in remoteLibrary
const remoteLibraryPath = path.resolve("remoteLibrary/node_modules");

executeCommand(`cd ${remoteLibraryPath}`);

packagesToLink.forEach((command) => {
  executeCommand(`yarn link ${command}`);
});

console.log("Postinstall script completed successfully.");
