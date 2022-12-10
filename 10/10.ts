import { readFileSync } from "fs"
import path from "path"

const input = readFileSync(path.join(__dirname, "./input.txt"), "utf-8")
const inputArray = input.split("\r\n")

const getSignalStrengths = (input: string[]) => {
    const signalStrengths: number[] = []
    let x = 1
    input.forEach(command => {
        if (command === "noop") {
            signalStrengths.push(x)
        } else {
            const [_, value] = command.split(" ")
            signalStrengths.push(x)
            signalStrengths.push(x)
            x += Number(value)
        }
    })
    return signalStrengths
}

const getSignalStrength = (indexes: number[], data: number[]) => {
    return indexes.map(index => data[index - 1] * (index))
}

const signalStrengths = getSignalStrengths(inputArray)

const signalSum = getSignalStrength([20, 60, 100, 140, 180, 220], signalStrengths).reduce((a, b) => a + b)

console.log(signalSum)

const renderScreen = (input: string[]) => {
    let cycle = 1
    let screen = "";
    let spritePosition = 1

    const writeCharacter = () => {
        if (spritePosition === cycle % 40 -2 || spritePosition === cycle % 40 - 1 || spritePosition === cycle % 40) {
            screen += "#"
        } else {
            screen += "."
        }
        if (cycle % 40 === 0) {
            screen += "\n"
        }
    }
    input.forEach(command => {
        writeCharacter()
        cycle++
        if (command !== "noop") {
            const [_, value] = command.split(" ")
            writeCharacter()
            cycle++
            spritePosition += Number(value)
        }
    })
    return screen
}

console.log(renderScreen(inputArray))