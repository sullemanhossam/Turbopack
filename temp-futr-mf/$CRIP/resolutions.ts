type Target = string;

class EachPackageToLink {
  public generateAlias() {
    return `${this.alias}-v${this.version[0]}`;
    // this will make a alias like cool-v1
  }

  constructor(
    public targets: Target[],
    public alias: string,
    public pkg: string,
    public version: string
  ) {}
}

interface PackageConfig {
  targets: Target[];
  alias: string;
  pkg: string;
  version: string;
}

class PackagesToLink {
  packages: EachPackageToLink[];

  constructor(packages: PackageConfig[]) {
    this.packages = packages.map((pkg) => new EachPackageToLink(pkg.targets, pkg.alias, pkg.pkg, pkg.version));
  }
}

// Example usage:
const packages: PackageConfig[] = [
  // from seeing this alias doesnt need to be accurate perhaps make it a alias
  { targets: ["remoteLibrary"], alias: "heroicons", pkg: "@heroicons/react", version: "1.4.1" },
  { targets: ["remoteLibrary"], alias: "heroicons", pkg: "@heroicons/react", version: "2.1.3" },
];

module.exports = {
  packagesToLink: new PackagesToLink(packages)["packages"],
  //   get the object key so it seems like a normal array
};
