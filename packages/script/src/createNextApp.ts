import prompts from "prompts";
import path from "path";
import { asyncExecCommand, getJSONFromFile } from "utils";
import loading from "loading-cli";
import { cpSync, readFileSync, rmSync, writeFileSync } from "fs";
import handleCliError from "handle-cli-error";
import { exit } from "process";
import { getMonorepoRootPackageJSON } from "utils/getMonorepoRootPackageJSON";
import {
  NEXT_APP_DEPENDENCY,
  NEXT_APP_DEV_DEPENDENCY,
  CREATE_NEXT_APP_OPTIONS,
  CreateNextAppOptionAnswers,
  CREATE_NEXT_APP_TEMPLATE_DIR,
  NEXT_APP_MONOREPO_DEPENDENCY,
  NEXT_APP_MONOREPO_DEV_DEPENDENCY,
} from "./constants";
import { getReplacer } from "utils/getReplacer";

const getCreateNextAppCommand = (options: CreateNextAppOptionAnswers) => {
  const {
    appName,
    isUseTypeScript,
    isUseESLint,
    isUseTailwindCSS,
    isUseSrc,
    isUseAppRouter,
    isUseImportAlias,
    importAliasSymbol,
  } = options;

  const baseCommand = "pnpm dlx create-next-app";
  const projectDir = path.join(__dirname, "..", "..", "..", "apps", appName);
  const langauge = isUseTypeScript ? "--typescript" : "--javascript";
  const eslint = isUseESLint ? "--eslint" : "";
  const tailwindCSS = isUseTailwindCSS ? "--tailwind" : "";
  const srcDir = isUseSrc ? "--src-dir" : "";
  const appRouter = isUseAppRouter ? "--app" : "--no-app";
  const importAlias =
    isUseImportAlias && importAliasSymbol
      ? `--import-alias "${importAliasSymbol}"`
      : "";
  const packageManager = "--use-pnpm";

  return [
    baseCommand,
    projectDir,
    langauge,
    eslint,
    tailwindCSS,
    srcDir,
    appRouter,
    importAlias,
    packageManager,
  ].join(" ");
};

(async () => {
  const answers = (await prompts(
    CREATE_NEXT_APP_OPTIONS
  )) as CreateNextAppOptionAnswers;
  const monorepoRootPackageJSON = getMonorepoRootPackageJSON();

  const createNextApp = async (answers: CreateNextAppOptionAnswers) => {
    const command = getCreateNextAppCommand(answers);
    const load = loading(
      "Creating Next.js app into monorepo apps directory..."
    );

    load.start();
    await asyncExecCommand(command);
    load.succeed();
    const nextAppPath = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "apps",
      answers.appName
    );

    return nextAppPath;
  };

  const getNextAppPackageJSON = (nextAppPath: string) => {
    const nextAppPackageJSONPath = path.join(nextAppPath, "package.json");
    return [nextAppPackageJSONPath, getJSONFromFile(nextAppPackageJSONPath)];
  };

  const getNextAppESLintJSON = (nextAppPath: string) => {
    const nextAppESLintJSONPath = path.join(nextAppPath, ".eslintrc.json");
    return [nextAppESLintJSONPath, getJSONFromFile(nextAppESLintJSONPath)];
  };

  const renameNextApp = (
    nextAppPackageJSONPath: string,
    nextAppPackageJSON: any
  ) => {
    nextAppPackageJSON.name = `@${monorepoRootPackageJSON.name}/${nextAppPackageJSON.name}`;
    writeFileSync(
      nextAppPackageJSONPath,
      JSON.stringify(nextAppPackageJSON, undefined, 2)
    );
  };

  const addDependencyToNextApp = async (nextAppPath: string) => {
    process.chdir(nextAppPath);
    const commands: string[] = [];
    const isEmptyCommand =
      NEXT_APP_DEPENDENCY.length === 0 && NEXT_APP_DEV_DEPENDENCY.length === 0;

    if (!isEmptyCommand) {
      if (NEXT_APP_DEPENDENCY.length > 0) {
        commands.push(["pnpm add", ...NEXT_APP_DEPENDENCY].join(" "));
      }
      if (NEXT_APP_DEV_DEPENDENCY.length > 0) {
        commands.push(["pnpm add -D", ...NEXT_APP_DEV_DEPENDENCY].join(" "));
      }

      const command = commands.join(" && ");

      const load = loading("Adding monorepo dependency to Next.js app...");

      load.start();
      await asyncExecCommand(command);
      load.succeed();
    }
  };

  const setupESLintToNextApp = (
    nextAppESLintJSONPath: string,
    nextAppESLintJSON: any
  ) => {
    const load = loading(
      "Setup ESLint of Next.js app to use `eslint-config-monorepo`..."
    );

    load.start();
    nextAppESLintJSON["$schema"] = "https://json.schemastore.org/eslintrc";
    nextAppESLintJSON.extends = ["monorepo/next"];
    writeFileSync(
      nextAppESLintJSONPath,
      JSON.stringify(nextAppESLintJSON, undefined, 2)
    );
    load.succeed();
  };

  const setupPostCSSToNextApp = (nextAppPath: string) => {
    const nextAppPostCSSConfigPath = path.join(
      nextAppPath,
      "postcss.config.js"
    );
    const templatePostCSSConfigPath = path.join(
      CREATE_NEXT_APP_TEMPLATE_DIR,
      "postcss.config.js"
    );

    const load = loading("Setup postcss.config.js of Next.js app...");

    load.start();
    rmSync(nextAppPostCSSConfigPath);
    cpSync(templatePostCSSConfigPath, nextAppPostCSSConfigPath);
    load.succeed();
  };

  const setupTSConfigToNextApp = (nextAppPath: string) => {
    const nextAppTSConfigPath = path.join(nextAppPath, "tsconfig.json");
    const templateTSConfigPath = path.join(
      CREATE_NEXT_APP_TEMPLATE_DIR,
      "tsconfig.json"
    );

    const load = loading("Setup tsconfig.json of Next.js app...");

    load.start();
    rmSync(nextAppTSConfigPath);
    cpSync(templateTSConfigPath, nextAppTSConfigPath);
    load.succeed();
  };

  const setupTailwindConfigToNextApp = (nextAppPath: string) => {
    const nextAppTSConfigPath = path.join(nextAppPath, "tailwind.config.ts");
    const templateTSConfigPath = path.join(
      CREATE_NEXT_APP_TEMPLATE_DIR,
      "tailwind.config.ts"
    );

    const load = loading("Setup tailwind.config.ts of Next.js app...");

    load.start();
    rmSync(nextAppTSConfigPath);
    cpSync(templateTSConfigPath, nextAppTSConfigPath);
    load.succeed();
  };

  const setupNextConfigToNextApp = (nextAppPath: string) => {
    const nextAppNextConfigPath = path.join(nextAppPath, "next.config.js");
    const templateNextConfigPath = path.join(
      CREATE_NEXT_APP_TEMPLATE_DIR,
      "next.config.js"
    );

    const load = loading("Setup next.config.js of Next.js app...");

    const templateNextConfig = readFileSync(templateNextConfigPath).toString();
    const transpilePackages = [
      ...NEXT_APP_MONOREPO_DEPENDENCY,
      ...NEXT_APP_MONOREPO_DEV_DEPENDENCY,
    ]
      .map((itm) => `"${itm}",`)
      .join("\n    ");
    const newValue = templateNextConfig.replace(
      getReplacer("transpilePackages"),
      transpilePackages
    );

    load.start();
    rmSync(nextAppNextConfigPath);
    writeFileSync(nextAppNextConfigPath, newValue);
    load.succeed();
  };

  const disableSideEffectsToNextApp = (
    nextAppPackageJSONPath: string,
    nextAppPackageJSON: any
  ) => {
    const load = loading("Setup sideEffects to package.json of Next.js app...");

    load.start();
    nextAppPackageJSON.sideEffects = false;
    writeFileSync(
      nextAppPackageJSONPath,
      JSON.stringify(nextAppPackageJSON, undefined, 2)
    );
    load.succeed();
  };

  try {
    const nextAppPath = await createNextApp(answers);
    const [nextAppPackageJSONPath, nextAppPackageJSON] =
      getNextAppPackageJSON(nextAppPath);
    const [nextAppESLintJSONPath, nextAppESLintJSON] =
      getNextAppESLintJSON(nextAppPath);
    renameNextApp(nextAppPackageJSONPath, nextAppPackageJSON);
    disableSideEffectsToNextApp(nextAppPackageJSONPath, nextAppPackageJSON);
    await addDependencyToNextApp(nextAppPath);
    setupESLintToNextApp(nextAppESLintJSONPath, nextAppESLintJSON);
    setupPostCSSToNextApp(nextAppPath);
    setupTSConfigToNextApp(nextAppPath);
    setupTailwindConfigToNextApp(nextAppPath);
    setupNextConfigToNextApp(nextAppPath);
  } catch (e) {
    handleCliError(e);
    exit(1);
  }
})();
