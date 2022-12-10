import fs from "fs";
import path from "path"

export const getInput = (dirname: string) => {
    return fs.readFileSync(path.join(dirname, "./input.txt"), { encoding: "utf8"});
}

export const getInputAsArray = (dirname: string) => {
    return getInput(dirname).split("\n");
}