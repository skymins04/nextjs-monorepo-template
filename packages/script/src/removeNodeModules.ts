import path = require("path");
import { MONOREPO_ROOT_DIR_PATH } from "./constants";
import { existsSync, readdirSync, rmSync } from "fs";
import loading = require("loading-cli");

const sharedDirPath = path.join(MONOREPO_ROOT_DIR_PATH, "packages", "shared");
const packagesDirPath = path.join(MONOREPO_ROOT_DIR_PATH, "packages");

const monorepoRootNodeModulesDirPath = path.join(
  MONOREPO_ROOT_DIR_PATH,
  "node_modules"
);
const sharedNodeModulesDirPaths = readdirSync(sharedDirPath).map((itm) =>
  path.join(sharedDirPath, itm, "node_modules")
);
const packagesNodeModulesDirPaths = readdirSync(packagesDirPath).map((itm) =>
  path.join(packagesDirPath, itm, "node_modules")
);

const nodeModulesDirPaths = [
  monorepoRootNodeModulesDirPath,
  ...sharedNodeModulesDirPaths,
  ...packagesNodeModulesDirPaths,
];

const load = loading("Remove node_modules...");

load.start();
nodeModulesDirPaths.forEach((itm) => {
  if (existsSync(itm)) {
    rmSync(itm, { recursive: true, force: true });
    load.info(`removed node_modules: ${itm}`);
  }
});
load.succeed();
