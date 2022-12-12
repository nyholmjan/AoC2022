import { getInput } from "../fs"

const input = getInput(__dirname)

const getHeightMatrix = (input: string) => input.split("\n").map(row => row.split(""))

const getData = (input: string) => {
    const matrix = getHeightMatrix(input)
    const positions: Array<[number, number]> = [[0, 0], [0, 0]]
    const heightMatrix = matrix.map((row, y) => row.map((char, x) => {
        // Character conversion to int is unnecessary
        const heightCharacter = char === "S" ? "a" : char === "E" ? "z" : char
        if (char === "S") {
            positions[0][0] = x
            positions[0][1] = y
        }
        if (char === "E"){
            positions[1][0] = x
            positions[1][1] = y
        }
        return heightCharacter.charCodeAt(0) - 96
    }))
    return { heightMatrix, positions }
}

const getShortestPath = (input: string, testAllStartingPositions?: boolean) => {
    const { heightMatrix, positions } = getData(input)

    const adjecentList = new Map()

    const addEdge = (a: string, b: string) => {
        adjecentList.get(a).push(b)
    }

    const [start, finish] = positions

    const startingPoints = [`${start[0]}:${start[1]}`]


    testAllStartingPositions && heightMatrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value === 1 ) {
                startingPoints.push(`${x}:${y}`)
            }
        })
    })

    const findPath = (node: string, target: string) => {
        const visited = new Map()
        const unvisited = new Map()
        visited.set(node, 0)
    
        const queue = [];
        queue.push(node);

        heightMatrix.forEach((row, y) => {
            row.forEach((value, x) => {
                adjecentList.set(`${x}:${y}`, [])
            })
        })

        heightMatrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (heightMatrix[y - 1]?.[x] < value + 2) {
                    addEdge(`${x}:${y}`, `${x}:${y - 1}`)
                }
                if (heightMatrix[y + 1]?.[x] < value + 2) {
                    addEdge(`${x}:${y}`, `${x}:${y + 1}`)
                }
                if (heightMatrix[y]?.[x - 1] < value + 2) {
                    addEdge(`${x}:${y}`, `${x - 1}:${y}`)
                }
                if (heightMatrix[y]?.[x + 1] < value + 2) {
                    addEdge(`${x}:${y}`, `${x + 1}:${y}`)
                }
                unvisited.set(`${x}:${y}`, x === start[0] && y === start[1] ? 0 : Number.MAX_VALUE)
            })
        })
    
        while (queue.length > 0) {
            const current = queue.shift();
    
            const neighbours = adjecentList.get(current);
    
            for (const neighbour of neighbours) {
                const target = unvisited.get(neighbour)
                if (target !== undefined) {
                    visited.set(neighbour, visited.get(current) + 1)
                    unvisited.delete(neighbour)
                    queue.push(neighbour);
                } else if (visited.get(neighbour) + 1 < visited.get(current)) {
                    visited.set(neighbour, visited.get(current) + 1) 
                }
            }
        }
        return visited
    }
    return startingPoints.map(point => {
        const stepmap = findPath(point, `${finish[0]}:${finish[1]}`)
        return stepmap.get(`${finish[0]}:${finish[1]}`)
    })

}
console.time("first")
console.log("First:", getShortestPath(input)[0])
console.timeEnd("first")
console.time("second")
console.log("Second:", getShortestPath(input, true).sort((a,b) => a - b)[0])
console.timeEnd("second")
