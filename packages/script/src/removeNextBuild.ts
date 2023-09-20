import path = require("path");
import { MONOREPO_ROOT_DIR_PATH } from "./constants";
import { existsSync, readdirSync, rmSync } from "fs";
import loading = require("loading-cli");

const appsDirPath = path.join(MONOREPO_ROOT_DIR_PATH, "apps");
const packagesDirPath = path.join(MONOREPO_ROOT_DIR_PATH, "packages");

const appsNodeModulesDirPaths = readdirSync(appsDirPath).map((itm) =>
  path.join(appsDirPath, itm, ".next/")
);
const packagesNodeModulesDirPaths = readdirSync(packagesDirPath).map((itm) =>
  path.join(packagesDirPath, itm, ".next/")
);

const nodeModulesDirPaths = [
  ...appsNodeModulesDirPaths,
  ...packagesNodeModulesDirPaths,
];

const load = loading("Remove `.next/` ...");

load.start();
nodeModulesDirPaths.forEach((itm) => {
  if (existsSync(itm)) {
    rmSync(itm, { recursive: true, force: true });
    load.info(`removed \`.next/\`: ${itm}`);
  }
});
load.succeed();
