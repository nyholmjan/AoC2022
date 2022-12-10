import fs from "fs";
import path from "path"

const input = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf-8');
console.log(Math.max(...input.split("\r\n\r\n").map(item => item.split("\r\n").reduce((a,b) => Number(a)+Number(b), 0))))
console.time("b")
const inputArray = input.split("\r\n\r\n").map(item => item.split("\r\n").reduce((a,b) => Number(a)+Number(b), 0))
console.timeEnd("b")
console.time("a")
const max = Math.max(...inputArray)
console.timeEnd("a")
console.time("remove Max")
inputArray.splice(inputArray.indexOf(max),1)
console.timeEnd("remove Max")

const sorted = inputArray.sort((a, b) => a - b)

// @ts-ignore the values are not undefined
console.log(sorted.at(-1) + sorted.at(-2) + sorted.at(-3))