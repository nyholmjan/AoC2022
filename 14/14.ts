import fs from "fs"
import path from "path"
import { getInputAsArray } from "../fs";

const input = getInputAsArray(__dirname)
const render = (gridSize: any, rocks: number[][], fileName: string) => {
    let screen = "";
    for (let y = 0; y <= rocks[1].length; y++) {
        for (let x = 0; x <= rocks.length; x++) {
            if (rocks?.[x]?.[y] === 1) screen += "#"
            else if (rocks?.[x]?.[y] === 0) screen += "."
            else if (rocks?.[x]?.[y] === 2) screen += "O"
            else if (rocks?.[x]?.[y] === 3) screen += "+"
            if (x === gridSize.x[1]) screen += "\n"
        }
    }
    fs.writeFileSync(path.join(__dirname, `./${fileName}.txt`), screen)
}

const map = (input: string[], hasFloor?: boolean) => {
    const rocks = input.map(a => a.split("->").map(a => a.trim().split(",").map(Number)))
    const gridSize = { x: [0, 1000], y: [0, 0] }

    rocks.forEach(a => {
        a.forEach(([x, y]) => {
            gridSize.y[1] = Math.max(gridSize.y[1], y + 3)
        })
    })

    const rockMatrix = Array.from(Array(gridSize.x[1]), () => Array.from(Array(gridSize.y[1]), () => 0))
    rockMatrix[500][0] = 3
    rocks.forEach(line => {
        line.forEach((point, index) => {
            const previous = line[index - 1]
            if (!previous) return
            const axis = point[0] !== previous[0] ? 0 : 1
            const length = Math.abs(point[axis] - previous[axis])
            const sign = Math.sign(point[axis] - previous[axis])
            for (let i = 0; i <= length; i++) {
                if (axis === 0) rockMatrix[point[0] + i * sign * -1][point[1]] = 1
                else rockMatrix[point[0]][previous[1] + sign * i] = 1
            }
        })
    })

    if (hasFloor) {
        rockMatrix.forEach((a) => {
            a[a.length - 1] = 1
        })
    }

    let sand = 0
    const startingPosition = [500, 0]
    let addSand = true
    while (addSand) {
        let [x, y] = [...startingPosition]
        let isFalling = true

        // Can not fit more sand
        if (hasFloor && rockMatrix[x][y] === 2) {
            addSand = false
            break
        }
        while (isFalling) {
            // Falls through the matrix
            if (y + 1 >= rockMatrix[0].length) {
                isFalling = false
                addSand = false
                break
            }
            if (rockMatrix[x][y + 1] === 0) y++
            else if (rockMatrix[x - 1][y + 1] === 0) { y++; x-- }
            else if (rockMatrix[x + 1][y + 1] === 0) { y++; x++ }
            else { rockMatrix[x][y] = 2; isFalling = false }
        }
        sand++
    }



    render(gridSize,rockMatrix, hasFloor ? "output2" : "output1")
    // for the one without floor take the fallen one out
    return hasFloor ? sand : sand - 1

}

console.log("1", map(input, false))
console.log("2", map(input, true))
