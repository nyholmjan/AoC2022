import { getInputAsArray } from "../fs";

const input = getInputAsArray(__dirname);

const ropeLength = 10

const visited = new Set()

const tailIndex = ropeLength - 1

const rope: Record<"x" | "y", number>[] = []

for (let i = 0; i < tailIndex + 1; i += 1) {
    rope.push({ x: 0, y: 0 })
}

input.forEach(input => {
    const [direction, stepsString] = input.split(" ")
    const steps = parseInt(stepsString)
    for (let i = 1; i <= steps; i += 1) {
        rope.forEach((knot, knotIndex) => {
            if (knotIndex === 0) {
                switch (direction) {
                    case "U":
                            knot.y = knot.y + 1
                        break
                    case "R":
                            knot.x = knot.x + 1
                        break
                    case "D":
                            knot.y = knot.y - 1
                        break
                    case "L":
                            knot.x = knot.x - 1
                        break
                }
            } else {
                if (knot.y < rope[knotIndex - 1].y - 1) {
                    knot.y = rope[knotIndex - 1].y - 1

                    if (knot.x < rope[knotIndex - 1].x) {
                        knot.x += 1
                    } else if (knot.x > rope[knotIndex - 1].x) {
                        knot.x -= 1
                    }
                    return
                }
                if (knot.y > rope[knotIndex - 1].y + 1) {
                    knot.y = rope[knotIndex - 1].y + 1

                    if (knot.x < rope[knotIndex - 1].x) {
                        knot.x += 1
                    } else if (knot.x > rope[knotIndex - 1].x) {
                        knot.x -= 1
                    }
                    return
                }
                if (knot.x > rope[knotIndex - 1].x + 1) {
                    knot.x = rope[knotIndex - 1].x + 1

                    if (knot.y < rope[knotIndex - 1].y) {
                        knot.y += 1
                    } else if (knot.y > rope[knotIndex - 1].y) {
                        knot.y -= 1
                    }
                    return
                }
                if (knot.x < rope[knotIndex - 1].x - 1) {
                    knot.x = rope[knotIndex - 1].x - 1

                    if (knot.y < rope[knotIndex - 1].y) {
                        knot.y += 1
                    } else if (knot.y > rope[knotIndex - 1].y) {
                        knot.y -= 1
                    }
                    return
                }
            }
        })
        visited.add(`X${rope[tailIndex].x}Y${rope[tailIndex].y}`)
    }
})

console.log(visited.size)
