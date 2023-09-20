import { exec } from "child_process";

export const asyncExecCommand = async (command: string) => {
  return new Promise<void>((res, rej) => {
    const process = exec(command);
    process.addListener("exit", () => {
      res();
    });
    process.addListener("error", (err) => {
      rej(err);
    });
  });
};
