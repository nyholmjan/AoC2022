import { getInput } from "../fs";

const input = getInput(__dirname)

const [startingStateInput, instructions] = input.split("\n\n")

const startingStateInputLines = startingStateInput.split("\n")

const startingArray = startingStateInputLines.splice(0, startingStateInputLines.length - 1)


const stacks: string[][] = Array(9)
const stacks2: string[][] = Array(9)


for (let i = 0; i < 9; i += 1) {
    stacks[i] = []
    stacks2[i] = []
    startingArray.forEach(boxRowString => {
        const value = boxRowString.at(i*4+1)
        if (value && value !== " ") {
            stacks[i].unshift(value)
            stacks2[i].unshift(value)
        }
    })
}

const instructionsArray = instructions.split("\n")

console.time("5/1")
instructionsArray.forEach(instructionLine => {
    const [_amount, amount, _from, from, _to, to] = instructionLine.split(" ").map(Number)
    for (let i = 0; i < amount; i += 1) {
        stacks[to - 1].push(stacks[from - 1].pop() as string)
    }
})
console.timeEnd("5/1")

console.log(stacks.map(a => [
    a.at(-1)
]).join(""))


console.time("5/2")
instructionsArray.forEach(instructionLine => {
    const [_amount, amount, _from, from, _to, to] = instructionLine.split(" ").map(Number)
    stacks2[to - 1].push(...stacks2[from - 1].splice(- amount))
})
console.timeEnd("5/2")

console.log(stacks2.map(a => [
    a.at(-1)
]).join(""))
