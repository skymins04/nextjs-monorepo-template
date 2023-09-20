import path from "path";

export const MONOREPO_ROOT_DIR_PATH = path.join(
  __dirname,
  "..",
  "..",
  "..",
  ".."
);

export const TEMPLATE_DIR_PATH = path.join(__dirname, "..", "templates");

export const COMMON_MONOREPO_DEPENDENCY: string[] = ["@shared/core"];
export const COMMON_MONOREPO_DEV_DEPENDENCY: string[] = [
  "@config/tsconfig",
  "eslint-config-monorepo",
];

export const COMMON_DEPENDENCY: string[] = [];
export const COMMON_DEV_DEPENDENCY: string[] = [];
