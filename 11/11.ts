import { getInput } from "../fs"

const input = getInput(__dirname)

type WorryOperator = "*" | "+"
type WorryOperation = [WorryOperator, number | "old"]

const getMonkeys = (input: string) => {
    const monkeys = input.split("\n\n")
    return monkeys.map(monkeyString => {
        const rows = monkeyString.split("\n")
        const [_a, _b, ...items] = rows[1].trim().replaceAll(",", "").split(" ").map(Number)
        const [_, ...operation] = rows[2].split("=")[1].trim().split(" ")
        const testDividend = Number(rows[3].split(" ").at(-1))
        const action = [rows[4].split(" ").at(-1), rows[5].split(" ").at(-1)].map(Number)
        return { items, operation, testDividend, action, inspections: 0 }
    })
}

const calculateWorryLevel = (current: number, worryOperation: WorryOperation) => {
    const operand = worryOperation[1] === "old" ? current : Number(worryOperation[1])
    return worryOperation[0] === "+" ? operand + current : operand * current
}

const getBoredWithItem = (itemValue: number) => Math.floor(itemValue / 3)

const runGame = (rounds: number, input: string) => {
    console.time("Game")
    const monkeys = getMonkeys(input)
    for (let i = 0; i < rounds; i++) {
        monkeys.forEach((monkey, index) => {
            monkey.items.forEach(item => {
                monkey.inspections++
                let worryLevel = getBoredWithItem(calculateWorryLevel(item, monkey.operation as WorryOperation))
                const target = worryLevel % monkey.testDividend === 0 ? monkey.action[0] : monkey.action[1]
                monkeys[target].items.push(worryLevel)
            })
            monkey.items = []
        })
    }

    console.timeEnd("Game")
    return monkeys
}

const runGameWithoutBoredomWorries = (rounds: number, input: string) => {
    console.time("Game")
    const monkeys = getMonkeys(input)
    const factored = monkeys.reduce((a, b) => a * b.testDividend, 1)
    for (let i = 0; i < rounds; i++) {
        monkeys.forEach((monkey, index) => {
            monkey.items.forEach(item => {
                monkey.inspections++
                let worryLevel = calculateWorryLevel(item, monkey.operation as WorryOperation)
                worryLevel = worryLevel % factored
                if (worryLevel % monkey.testDividend === 0) {
                    monkeys[monkey.action[0]].items.push(worryLevel)
                } else {
                    monkeys[monkey.action[1]].items.push(worryLevel)
                }
            })
            monkey.items = []
        })
    }

    console.timeEnd("Game")
    return monkeys
}

const sortedByInspections = runGame(20, input).sort((a, b) => a.inspections - b.inspections)
const monkeyBusiness = sortedByInspections[sortedByInspections.length - 1].inspections * sortedByInspections[sortedByInspections.length - 2].inspections

console.log("first", monkeyBusiness)

const sortedByInspections2 = runGameWithoutBoredomWorries(10000, input).sort((a, b) => a.inspections - b.inspections)
const monkeyBusiness2 = sortedByInspections2[sortedByInspections2.length - 1].inspections * sortedByInspections2[sortedByInspections2.length - 2].inspections

console.log("second", monkeyBusiness2)
