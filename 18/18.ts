import { getInput } from "../fs";

type Coord = [number, number, number]

const input = getInput(__dirname)

const coordArr = input.split("\n").map(str => str.split(",").map(Number)) as Coord[]

const testSet = (coord: Coord) => (new Set([
    `${coord[0]},${coord[1]},${coord[2] + 1}`,
    `${coord[0]},${coord[1]},${coord[2] - 1}`,
    `${coord[0]},${coord[1] + 1},${coord[2]}`,
    `${coord[0]},${coord[1] - 1},${coord[2]}`,
    `${coord[0] + 1},${coord[1]},${coord[2]}`,
    `${coord[0] - 1},${coord[1]},${coord[2]}`
]))

const test = (coord: Coord, arr: Coord[]) => {
    const test = testSet(coord)

    return 6 - arr.reduce((n, a) =>
            n + (test.has(`${a[0]},${a[1]},${a[2]}`) ? 1 : 0),
    0)
}

const solve1 = (coordArr: Coord[]) => {
    console.log("1", coordArr.reduce((a, b) => a + test(b, coordArr), 0))
}


const solve2 = (arr: Coord[]) => {
    const cubes = new Set(arr.map(a => `${a[0]},${a[1]},${a[2]}`))

    let sides = 0
    const seen = new Set("0,0,0")
    const max = Math.max(...arr.flatMap(a => a)) + 1
    const queue = [[0,0,0]]
    while (queue.length > 0) {
        const current = queue.shift() as Coord
        const test = testSet(current)

        test.forEach(neighbour => {
            if (
                Math.max(...neighbour.split(",").map(Number)) > max ||
                Math.min(...neighbour.split(",").map(Number)) < -1
            ) return
            else if (cubes.has(neighbour)) sides += 1
            else if (!seen.has(neighbour)) {
                seen.add(neighbour)
                queue.push(neighbour.split(",").map(Number))
            }
        })
    }

    console.log("2", sides)
}

console.time("1")
solve1(coordArr)
console.timeEnd("1")

console.time("2")
solve2(coordArr)
console.timeEnd("2")

