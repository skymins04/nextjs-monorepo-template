import { readFileSync } from "fs";

export const getJSONFromFile = (path: string) => {
  const rawJSONString = readFileSync(path).toString();
  return JSON.parse(rawJSONString);
};
