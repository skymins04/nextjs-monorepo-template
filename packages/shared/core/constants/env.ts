export type ReleaseEnv = "develop" | "qa" | "production";

export const RELEASE_ENV = (() => process.env.RELEASE_ENV as ReleaseEnv)();
