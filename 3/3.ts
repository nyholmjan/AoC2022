import { readFileSync } from "fs"
import path from "path"
import { getInputAsArray } from "../fs";

const inputArray = getInputAsArray(__dirname);

console.log(inputArray.length)
console.time("3/1")
const res = inputArray.reduce((value, sack) => {
    const compA = sack.substring(0, sack.length / 2)
    const compB = sack.substring(sack.length / 2)
    const char = [...compA].find(a => compB.indexOf(a) > -1) as string;
    return value + char.charCodeAt(0) > 96 ? char.charCodeAt(0) - 96 : char.charCodeAt(0) - 38
}, 0)
console.timeEnd("3/1")
console.log(res)

console.time("3/2")
let res2 = 0;
for (let i = 0; i < inputArray.length; i += 3) {
    const char = [...inputArray[i]].find(a => inputArray[i+1].indexOf(a) > -1 && inputArray[i+2].indexOf(a) > -1) as string;
    res2 += char.charCodeAt(0) > 96 ? char.charCodeAt(0) - 96 : char.charCodeAt(0) - 38
};
console.timeEnd("3/2")
console.log(res2)