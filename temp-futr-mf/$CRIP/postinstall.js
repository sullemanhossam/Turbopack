const path = require("path");
const { executeCommand } = require("./ad-hoc.js");
const { packagesToLink } = require("./resolutions.ts");

try {
  // link all the packages to the main thread
  packagesToLink.forEach(({ generateAlias }) => {
    //  go inside the location of this package in case they installed for the first time or redo as this removes sym links
    const packagePath = path.resolve(`packages/${generateAlias()}/node_modules`);
    const linkCommand = `yarn link`;
    executeCommand(`cd ${packagePath} && ${linkCommand}`);
    // apply link to the target location [location is prepped during preinstall]
  });

  // once all packages are linked...

  packagesToLink.forEach(({ targets }) => {
    // for each package we want to follow its instructions
    targets.forEach((x) => {
      // first see what targets are for this file
      const remoteLibraryPath = path.resolve(`${x}/node_modules`);
      // navigate
      executeCommand(`cd ${remoteLibraryPath}`);
      executeCommand(`yarn link ${generateAlias()}`);
      // apply pkg by making a sym link
    });
  });

  console.log("Postinstall script completed successfully.");
} catch (error) {
  console.log(`Postinstall script failed gracefully ${error}.`);
}
