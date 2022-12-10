import { getInputAsArray } from "../fs";

const terminalOutput = getInputAsArray(__dirname)

const directories: Record<string, number> = { "/": 0 }

let currentPath: string[] = []

const changeDir = (line: string) => {
    const [_preamble, _command, parameter] = line.split(" ")
    if (parameter === "..") {
        currentPath.pop()
    } else if (parameter === "/") {
        currentPath = []
    } else {
        currentPath.push(parameter)
    }
}

const addBytesToDirs = (line: string) => {
    const [value, filename] = line.split(" ")
    const valueAsNumber = Number(value)
    directories["/"] =  directories["/"] += valueAsNumber
    currentPath.forEach((path, index) => {
        const directory = `/${currentPath.slice(0, index + 1).join("/")}`
        directories[directory] = directories[directory] ? directories[directory] + valueAsNumber : valueAsNumber
    })
}

terminalOutput.forEach(output => {
    if (output.startsWith("$")) changeDir(output)
    if (!isNaN(Number(output.split(" ")[0]))) addBytesToDirs(output)
})

const value = Object.values(directories).filter(val => val <= 100000)
console.log(value.reduce((a, b) => a + b))

const dirsToDeleteFrom = Object.values(directories).filter(val => val >= 30000000 - (70000000 - directories["/"]))

dirsToDeleteFrom.sort((a, b) => a - b);
console.log(dirsToDeleteFrom[0])
