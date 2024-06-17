//  here we would like to set up the folders for the installs
const { executeCommand, directoryExists } = require("./ad-hoc");

try {
  packagesToLink.forEach(async (pkg, version, generateAlias) => {
    const alreadyInitalised = await directoryExists(`packages/${generateAlias()}`);
    if (alreadyInitalised) {
      return;
      //  this should stop execution if this path exists already
    }
    executeCommand(`mkdir packages/${alias}`);
    executeCommand(`cd packages/${alias}`);
    //  create and navigate to destination path
    executeCommand(`npm init`);
    // make it a npm location if its not already
    executeCommand(`yarn install ${pkg}@${version}`);
    //  and install simple as
  });
  console.log("Preinstall script completed successfully.");
} catch (error) {
  console.log(`Preinstall script failed gracefully ${error}.`);
}

// ! this script should for each of the packages listed make a path for it and also install whatever package we are looking for
