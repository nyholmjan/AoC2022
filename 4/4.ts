import { getInput, getInputAsArray } from "../fs";

const input = getInputAsArray(__dirname)

console.time("4/1")
const result1 = input.reduce((accumulator, pair) => {
    const [firstElf, secondElf] = pair.split(",")
    const [A1, A2] = firstElf.split("-").map(a => Number(a))
    const [B1, B2] = secondElf.split("-").map(a => Number(a))
    if (A1 >= B1 && A2 <= B2 || B1 >= A1 && B2 <= A2) {
        return accumulator += 1
    } else {
        return accumulator
    }
}, 0)
console.timeEnd("4/1")

console.log(result1)

console.time("4/2")
const result2 = input.reduce((accumulator, pair) => {
    const [firstElf, secondElf] = pair.split(",")
    const [A1, A2] = firstElf.split("-").map(Number)
    const [B1, B2] = secondElf.split("-").map(Number)
    if (A2 < B1 || A1 > B2) {
        return accumulator -= 1
    } else {
        return accumulator
    }
}, input.length)
console.timeEnd("4/2")
console.log(result2)