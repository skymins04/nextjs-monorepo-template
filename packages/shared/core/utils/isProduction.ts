import { RELEASE_ENV } from "../constants/env";

export const isProduction = () => RELEASE_ENV === "production";
