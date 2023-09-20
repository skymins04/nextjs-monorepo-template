import path from "path";
import { getJSONFromFile } from "./getJSONFromFile";

export const getMonorepoRootPackageJSON = () => {
  const monorepoRootPackageJSONPath = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "..",
    "package.json"
  );
  return getJSONFromFile(monorepoRootPackageJSONPath);
};
