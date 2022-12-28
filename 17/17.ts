import { getInput } from "../fs"
import fs from "fs";
import path from "path";

const tileInput = `####

.#.
###
.#.

..#
..#
###

#
#
#
#

##
##`

type Row = [number, number, number, number, number, number, number];

const input = getInput(__dirname)

const transpose = (m: any[][]) =>
    Array.from(
        Array(m[0].length), (_, i) =>
            Array.from(
                Array(m.length), (_, j) => m[j][i]))

const draw = (state: number[][]) => {
    const transposed = state
    let output = ""
    for (let i = transposed.length; i > 0; i--) {
        if (!transposed[i]) continue
        transposed[i].forEach(a => {
            const val = a === 0 ? "." : "#"
            output += val
        })
        output += "\n"
    }

    fs.writeFileSync(path.join(__dirname, "out.txt"), output)
}

const tiles = tileInput
    .split("\n\n")
    .map(t =>
        t.split("\n")
            .reduce((tile, row) => [...tile, row.split("").map(cell => cell === "#" ? 1 : 0)], [] as (0 | 1)[][])
    ).map(transpose)

const tilesCoordinates = tiles.map(t => {
    const blocks: [number, number][] = []
    t.forEach((col, x) => {
        col.reverse().forEach((val, y) => {
            if (val) blocks.push([x, y])
        })
    })
    return blocks
})

const solve = async (input: string, toAmount: number) => {
    const gaswinds = input.split("").map(d => d === "<" ? -1 : 1)
    let rocks = 0
    let windIndex = 0
    let tileIndex = 0
    const tunnel: Row[] = []
    let skippedLength = 0
    const patterns = new Map()
    let found = false
    let patternStart = 0
    let patternStartRocks = 0
    let previousHeight = 0

    while (rocks < toAmount) {
        const patternIndex = `${tileIndex}-${windIndex}`
        if (!found) {
            if (patterns.has(patternIndex)) {
                // We recognize the pattern after passing it once
                if (patternStart === 0) {
                    patternStart = tunnel.length
                    patternStartRocks = rocks
                    patterns.clear()
                } else {
                    // After the second pass (+1 rock) we know how the pattern looks like. We need the height of the previous state because we are on rock over the limit
                    const patternHeight = previousHeight - patternStart
                    const rocksInPattern = rocks - patternStartRocks - 1
                    rocks += Math.floor(toAmount / rocksInPattern) * rocksInPattern - rocksInPattern * 2
                    skippedLength = Math.floor(toAmount / rocksInPattern) * patternHeight - patternHeight * 2
                    found = true
                }
            } else {
                patterns.set(patternIndex, true)
                previousHeight = tunnel.length
            }
        }

        rocks += 1
        let pos = 2
        const tile = tilesCoordinates[tileIndex]
        let height = tunnel.length

        // tiles appear 3 rows above highest tile
        for (let i = 0; i < 3; i++) {
            if (
                pos + gaswinds[windIndex] + tiles[tileIndex].length <= 7 &&
                pos + gaswinds[windIndex] >= 0 &&
                !tile.some(([x, y]) => tunnel[height + y]?.[x + gaswinds[windIndex]])
            ) {
                pos += gaswinds[windIndex]
            } else {
            }
            if (windIndex === gaswinds.length - 1) windIndex = 0
            else windIndex += 1
        }
        let falling = true

        if (tunnel.length === 0) tunnel.push([0, 0, 0, 0, 0, 0, 0])
        while (falling) {
            if (
                pos + gaswinds[windIndex] + tiles[tileIndex].length <= 7 &&
                pos + gaswinds[windIndex] >= 0 &&
                !tile.some(([x, y]) => tunnel[height + y]?.[x + pos + gaswinds[windIndex]])
            ) {
                pos += gaswinds[windIndex]
            } else {
            }
            // check for collision and land
            if (
                height <= 0 || tile.some(([x, y]) =>  tunnel[height + y - 1]?.[pos + x])
            ) {
                tile.forEach(([x, y]) => {
                    if (height + y >= tunnel.length) {
                        for (let i = 0; i <= height + y - (tunnel.length - 1); i++) {
                            tunnel.push([0, 0, 0, 0, 0, 0, 0])
                        }
                    }
                    tunnel[height + y][pos + x] = 1
                })
                falling = false
            } else {
                height -= 1
            }
        
            if (windIndex === gaswinds.length - 1) windIndex = 0
            else windIndex += 1
        }
        if (tileIndex === tiles.length - 1) tileIndex = 0
        else tileIndex += 1
    }

    // await draw(tunnel)
    console.log(tunnel.length + skippedLength)
}

const test =  ">>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>"

console.time("1")
solve(input, 2022)
console.timeEnd("1")

console.time("2")
solve(input, 1_000_000_000_000)
console.timeEnd("2")


