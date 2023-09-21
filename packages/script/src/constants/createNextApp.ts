import { PromptObject } from "prompts";
import {
  COMMON_DEPENDENCY,
  COMMON_DEV_DEPENDENCY,
  COMMON_MONOREPO_DEPENDENCY,
  COMMON_MONOREPO_DEV_DEPENDENCY,
  TEMPLATE_DIR_PATH,
} from "./common";
import path from "path";

export const CREATE_NEXT_APP_OPTIONS: PromptObject<string>[] = [
  {
    type: "text",
    name: "appName",
    message: "What is your project named?",
  },
  {
    type: "toggle",
    name: "isUseTypeScript",
    message: "Would you like to use TypeScript with this project?",
    initial: true,
    active: "yes",
    inactive: "no",
  },
  {
    type: "toggle",
    name: "isUseESLint",
    message: "Would you like to use ESLint with this project?",
    initial: true,
    active: "yes",
    inactive: "no",
  },
  {
    type: "toggle",
    name: "isUseTailwindCSS",
    message: "Would you like to use Tailwind CSS with this project?",
    initial: true,
    active: "yes",
    inactive: "no",
  },
  {
    type: "toggle",
    name: "isUseSrc",
    message: "Would you like to use `src/` directory with this project?",
    initial: true,
    active: "yes",
    inactive: "no",
  },
  {
    type: "toggle",
    name: "isUseAppRouter",
    message: "Use App router (recommended)?",
    initial: false,
    active: "yes",
    inactive: "no",
  },
  {
    type: "toggle",
    name: "isUseImportAlias",
    message: "Would you like to customize the default import alias",
    initial: true,
    active: "yes",
    inactive: "no",
  },
  {
    type: (prev) => (prev === true ? "text" : null),
    name: "importAliasSymbol",
    message: "What import alias would you like configured?",
    initial: "@/*",
    hint: "@/*",
  },
];

export type CreateNextAppOptionAnswers = {
  appName: string;
  isUseTypeScript: boolean;
  isUseESLint: boolean;
  isUseTailwindCSS: boolean;
  isUseSrc: boolean;
  isUseAppRouter: boolean;
  isUseImportAlias: boolean;
  importAliasSymbol?: string;
};

export const CREATE_NEXT_APP_TEMPLATE_DIR = path.join(
  TEMPLATE_DIR_PATH,
  "createNextApp"
);

export const NEXT_APP_MONOREPO_DEPENDENCY: string[] = [
  ...COMMON_MONOREPO_DEPENDENCY,
  "@shared/react",
];
export const NEXT_APP_MONOREPO_DEV_DEPENDENCY: string[] = [
  ...COMMON_MONOREPO_DEV_DEPENDENCY,
  "@config/tailwind",
];

export const NEXT_APP_DEPENDENCY: string[] = [
  ...NEXT_APP_MONOREPO_DEPENDENCY,
  ...COMMON_DEPENDENCY,
  "preact",
];
export const NEXT_APP_DEV_DEPENDENCY: string[] = [
  ...NEXT_APP_MONOREPO_DEV_DEPENDENCY,
  ...COMMON_DEV_DEPENDENCY,
  "@typescript-eslint/eslint-plugin",
  "@typescript-eslint/parser",
  "eslint",
  "eslint-config-prettier",
  "eslint-plugin-prettier",
  "eslint-plugin-unused-imports",
  "postcss-import",
  "@tailwindcss/line-clamp",
  "@tailwindcss/typography",
  "@tailwindcss/forms",
];
