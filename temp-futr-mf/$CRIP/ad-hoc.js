// example.js

async function directoryExists(path) {
  try {
    await fs.access(path);
    return true;
  } catch (error) {
    return false;
  }
}

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

module.exports = {
  executeCommand: executeCommand,
  directoryExists: directoryExists,
};
