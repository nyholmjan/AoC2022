import fs from "fs";
import path from "path"
import { getInputAsArray } from "../fs";

const inputArray = getInputAsArray(__dirname);

const shapeScore = {
    X: 1,
    Y: 2,
    Z: 3
}

const gameScore = {
    A: {
        X: 3,
        Y: 6,
        Z: 0
    },
    B: {
        X: 0,
        Y: 3,
        Z: 6
    },
    C: {
        X: 6,
        Y: 0,
        Z: 3
    }
} as const;

console.time("Calculated scores")
console.log(inputArray.reduce((a, b) => a += shapeScore[b.split(" ")[1] as keyof typeof shapeScore] + gameScore[b.split(" ")[0]  as keyof typeof gameScore][b.split(" ")[1] as keyof typeof gameScore["A"]], 0))
console.timeEnd("Calculated scores")

const shapeSelect = {
    A: {
        X: "C",
        Y: "A",
        Z: "B"
    },
    B: {
        X: "A",
        Y: "B",
        Z: "C"
    },
    C: {
        X: "B",
        Y: "C",
        Z: "A"
    }
} as const;

const shapeScore2 = {
    A: 1,
    B: 2,
    C: 3
}

const gameScore2 = {
    X: 0,
    Y: 3,
    Z: 6
} as const;

console.time("Calculated winnings")
const result2 = inputArray.reduce((a: number, b) => {
    const [elf, me] = b.split(" ")
    const myShape = shapeSelect[elf as keyof typeof shapeSelect][me as keyof typeof shapeSelect["A"]]
    a += shapeScore2[myShape] + gameScore2[me as keyof typeof gameScore2]
    return a
}, 0)
console.timeEnd("Calculated winnings")

console.log(result2)