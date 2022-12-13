import { getInput } from "../fs";

const input = getInput(__dirname)

const solve = (input: string) => {
    const pairs = input.split("\n\n").map(pair => pair.split("\n").map((a) => JSON.parse(a)))
    const checkPair = (pair: any[]): boolean | void => {
        const [left, right] = pair
        for (let i = 0; i < Math.max(left.length, right.length); i++) {
            if (left[i] === undefined) {
                return true
            }
            if (right[i] === undefined) {
                return false
            }
            if (Number.isInteger(left[i]) && Number.isInteger(right[i])) {
                if (left[i] < right[i]) {
                    return true
                } else if (left[i] > right[i]) {
                    return false
                }
            } else if (Array.isArray(left[i]) && Array.isArray(right[i])) {
                const res  = checkPair([left[i], right[i]])
                if (res !== undefined) {
                    return res
                }
            } else if (Array.isArray(left[i])) {
                const res  = checkPair([left[i], [right[i]]])
                if (res !== undefined) {
                    return res
                }
            } else if (Array.isArray(right[i])) {
                const res  = checkPair([[left[i]], right[i]])
                if (res !== undefined) {
                    return res
                }
            }

        }
    }

    const indexes: number[] = []
    pairs.forEach((pair, index) => {
        if (checkPair(pair) !== false) indexes.push(index + 1)
    })
    console.log("Eka", indexes.reduce((a , b) => a+b))

    const list = input.split("\n").filter(a => a)
    list.push("[[2]]")
    list.push("[[6]]")
    list.sort((a, b) => {
        const res = checkPair([JSON.parse(a), JSON.parse(b)])
        if (res === undefined) return 0
        if (!res) return 1
        return -1
    })
    console.log("Toka", (list.indexOf("[[2]]") + 1) * (list.indexOf("[[6]]") + 1))

}

solve(input)

