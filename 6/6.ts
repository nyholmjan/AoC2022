import { getInput } from "../fs";

const input = getInput(__dirname)

const buffer = Buffer.from(input)

let ind = 0
let index = 0

const delimiterLength = 4
console.time("6/1")
while (ind === 0) {
    const quadruplet = buffer.subarray(index, index + delimiterLength)
    const noMatch = quadruplet.every(a => {
        return quadruplet.filter((b) => a === b).length < 2
    })
    if (noMatch) {
        if (!ind) ind = index + delimiterLength

        break
    }
    index += 1
}
console.timeEnd("6/1")
console.log(ind)

let ind2 = 0
let index2 = 0

const delimiterLength2 = 14

console.time("6/2")
while (ind2 === 0) {
    const quadruplet = buffer.subarray(index2, index2 + delimiterLength2)
    const noMatch = quadruplet.every(a => {
        return quadruplet.filter((b) => a === b).length < 2
    })
    if (noMatch) {
        if (!ind2) ind2 = index2 + delimiterLength2

        break
    }
    index2 += 1
}

console.timeEnd("6/2")
console.log(ind2)