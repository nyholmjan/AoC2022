import { getInput } from "../fs";

const input = getInput(__dirname)

const parseInput = (input: string[]) => {
    return input.map(row => {
        const split = row.split(" ")
        return {
            id: Number(split[1].replace(":", "")),
            oreBotCost: Number(split[6]),
            clayBotCost: Number(split[12]),
            obsidianBotCost: [Number(split[18]), Number(split[21])],
            geodeBotCost: [Number(split[27]), Number(split[30])]
        }
    })
}

// An ugly dog that looks like it will bite you comes through the door with your son. You look at the dog and hear your son saying: "Dad! Can I keep it?".
// After some thought, you respond: "Yes, if it didn't bite you my son, you may keep it"
const getKey = (minute: number, oreBots: number, clayBots: number, obsidianBots: number, geodeBots: number, geodes: number, obsidian: number, clay: number) => {
    return  minute + (oreBots << 4) + (clayBots << 10) + (obsidianBots << 13) + (geodeBots << 16) + obsidian + (clay << 8) + (geodes << 16)
}

const solve1 = (input: string[], time = 24) => {
    const blueprints = parseInput(input)
    const result: { id: number, geodes: number}[] = []
    blueprints.forEach(bp => {
        let maxGeodes = 0
        const tried = new Set()
        const queue = [{
            minute: 1,
            oreBots: 1,
            clayBots: 0,
            obsidianBots: 0,
            geodeBots: 0,
            ore: 0,
            clay: 0,
            obsidian: 0,
            geodes: 0,

        }]
        while (queue.length > 0) {
            const current = queue.shift() as typeof queue[number]
            const minute = current.minute + 1
            const ore = current.ore + current.oreBots
            const clay = current.clay + current.clayBots
            const obsidian = current.obsidian + current.obsidianBots
            const geodes = current.geodes + current.geodeBots

            if (geodes > maxGeodes) {
                maxGeodes = geodes
            }

            if (current.minute >= time) continue

            let maxResult = current.geodes;
            for (let i = 1; i <= time - current.minute; i++) {
                maxResult += current.geodeBots + i
            }
            // We only care about possible winners
            if (maxResult <= maxGeodes) continue

            const maxOreCost = Math.max(bp.oreBotCost, bp.clayBotCost, bp.obsidianBotCost[0], bp.obsidianBotCost[0])

            // Geode bot
            if (current.ore >= bp.geodeBotCost[0] && current.obsidian >= bp.geodeBotCost[1]) {
                const key = getKey(minute, current.oreBots, current.clayBots, current.obsidianBots, current.geodeBots + 1, geodes, obsidian - bp.geodeBotCost[1], clay)
                if (!tried.has(key)) {
                    const next = { ...current, geodeBots: current.geodeBots + 1, ore: ore - bp.geodeBotCost[0], minute, clay, obsidian: obsidian - bp.geodeBotCost[1], geodes }
                    queue.push(next)
                    tried.add(key)
                    // Always buy geode bots when available!
                    continue
                }
            }

            // Ore bot
            if (current.ore >= bp.oreBotCost && current.oreBots < maxOreCost) {
                const key = getKey(minute, current.oreBots + 1, current.clayBots, current.obsidianBots, current.geodeBots, geodes, obsidian, clay)
                if (!tried.has(key) && !(current.ore >= bp.geodeBotCost[0] && current.obsidian >= bp.geodeBotCost[1])) {
                    const next = { ...current, oreBots: current.oreBots + 1, ore: ore - bp.oreBotCost, minute, clay, obsidian, geodes }
                    queue.push(next)
                    tried.add(key)
                }
            }
            // Clay bot
            if (current.ore >= bp.clayBotCost && current.clayBots < bp.obsidianBotCost[1]) {
                const key = getKey(minute, current.oreBots, current.clayBots + 1, current.obsidianBots, current.geodeBots, geodes, obsidian, clay)
                if (!tried.has(key) && !(current.ore >= bp.geodeBotCost[0] && current.obsidian >= bp.geodeBotCost[1])) {
                    const next = { ...current, clayBots: current.clayBots + 1, ore: ore - bp.clayBotCost, minute, clay, obsidian, geodes }
                    queue.push(next)
                    tried.add(key)
                }
            }
            // Obsidian bot
            if (current.ore >= bp.obsidianBotCost[0] && current.clay >= bp.obsidianBotCost[1] && current.obsidianBots < bp.geodeBotCost[1]) {
                const key = getKey(minute, current.oreBots, current.clayBots, current.obsidianBots + 1, current.geodeBots, geodes, obsidian, clay - bp.obsidianBotCost[1])
                if (!tried.has(key) && !(current.ore >= bp.geodeBotCost[0] && current.obsidian >= bp.geodeBotCost[1])) {
                    const next = { ...current, obsidianBots: current.obsidianBots + 1, ore: ore - bp.obsidianBotCost[0], minute, clay: clay - bp.obsidianBotCost[1], obsidian, geodes }
                    queue.push(next)
                    tried.add(key)
                }
            }
            // Not building
            const bKey = getKey(minute, current.oreBots, current.clayBots, current.obsidianBots, current.geodeBots, geodes, obsidian, clay)
            if (!tried.has(bKey) && !(current.ore >= bp.geodeBotCost[0] && current.obsidian >= bp.geodeBotCost[1])) {
                tried.add(bKey)
                queue.push({ ...current, ore, minute, clay, obsidian, geodes })
            }
        }
        console.log((result.length + 1) + "/" + blueprints.length + " " + result.reduce((a, b) => a + b.geodes * b.id, 0))
        console.log(tried.size)
        console.log(maxGeodes)
        result.push({ geodes: maxGeodes, id: bp.id })
    })
    return { 1: result.reduce((a, b) => a + b.geodes * b.id, 0), 2: result.reduce((a, b) => a * b.geodes, 1) }
}

console.time("1")
console.log("1", solve1(input.split("\n"))["1"])
console.timeEnd("1")

console.time("2")
console.log("2", solve1(input.split("\n").slice(0, 3), 32)["2"])
console.timeEnd("2")