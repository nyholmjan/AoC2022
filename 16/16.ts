import { getInput } from "../fs"
import bfs from "../util/bfs";

/*
The current state of this is by no means usable. As you can see this is a quick and dirty solution.
The first will run in a few milliseconds, but second took 2h38minutes on a laptop.
 */

const testInput = `Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
Valve BB has flow rate=13; tunnels lead to valves CC, AA
Valve CC has flow rate=2; tunnels lead to valves DD, BB
Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
Valve EE has flow rate=3; tunnels lead to valves FF, DD
Valve FF has flow rate=0; tunnels lead to valves EE, GG
Valve GG has flow rate=0; tunnels lead to valves FF, HH
Valve HH has flow rate=22; tunnel leads to valve GG
Valve II has flow rate=0; tunnels lead to valves AA, JJ
Valve JJ has flow rate=21; tunnel leads to valve II`

const input = getInput(__dirname)

const getValves = (input: string) => {
    const valves =  Object.fromEntries(input.split("\n").map(row => {
        const [a, b, c, d, e, ...rest] = row.split(" ")
        const to = rest.splice(4).map(a => a.replace(",", ""))
        return {
            name: b,
            rate: parseInt(e.replace(";", "").split("=")[1]),
            to,
            paths: {} as Record<string, number>
        }
    }).map(a => [a.name, a]))
    Object.values(valves).forEach(valve => {
        bfs(valves, valve)
    })
    return valves
}




const pressureRelief = (input: string) => {
    const totalTime = 30
    const valves = getValves(input)
    const start = valves["AA"]
    Object.values(valves).forEach(valve => {
        if (valve.rate === 0 && valve.name !== "AA") {
            delete valves[valve.name]
        }
    })
    let end = 0
    let path = ""
    const queue = [{
            time: totalTime,
            name: start.name,
            open: {} as Record<string, boolean>,
            cumulativeFlow: 0,
            paths: start.paths,
            path: start.name
        }]
    console.time("Find paths")
    while (queue.length > 0) {
        const current = queue.shift();
        if (!current) throw new Error("Will not happen")
        const unopened = Object.values(valves).filter(a => a.rate !== 0 && !current.open[a.name])
        if (unopened.length === 0) {
            if (current.cumulativeFlow > end) {
                end = current.cumulativeFlow
                path = "Out of valves: 0:" + current.path
            }
        }
        for (const target of unopened) {
            const steps = valves[current.name].paths[target.name] + 1
            if (current.time - steps <= 0) {
                if (current.cumulativeFlow > end) {
                    end = current.cumulativeFlow
                    path = "Out of time: 0:" + current.path
                }
            } else {
                queue.push({
                    time: current.time - steps,
                    name: target.name,
                    open: { ...current.open, [target.name]: true },
                    paths: target.paths,
                    cumulativeFlow: current.cumulativeFlow + target.rate * (current.time - steps),
                    path: current.path + "-" + (30 - (current.time - steps)) + ":"+ target.name
                })
            }
        }
    }
    console.timeEnd("Find paths")
    console.log(path)
    return end
}

console.time("1")
const res1 = pressureRelief(input)
console.timeEnd("1")
console.log(res1)


const pressureRelief2 = (input: string, withFant?: boolean) => {
    const totalTime = withFant ? 26 : 30
    const valves = getValves(input)
    const start = valves["AA"]
    Object.values(valves).forEach(valve => {
        if (valve.rate === 0 && valve.name !== "AA") {
            delete valves[valve.name]
        }
    })
    let end = 0
    let path = ""
    let elPath = ""
    const queue = [{
        time: totalTime,
        elTime: totalTime,
        name: start.name,
        elName: start.name,
        open: {} as Record<string, boolean>,
        cumulativeFlow: 0,
        paths: start.paths,
        elPaths: start.paths,
    }]
    console.time("Find paths")
    const cache = new Map()
    let timer = Date.now()
    while (queue.length > 0) {
        if (Date.now() - timer > 5000) {
            timer = Date.now()
            console.log(queue.length)
        }
        const current = queue.shift();
        if (!current) throw new Error("Will not happen")
        const key = `${current.time}${current.name}${current.elTime}${current.elName}`
        if (cache.get(key) >= current.cumulativeFlow) {
            continue
        }
        cache.set(key, current.cumulativeFlow)
        const unopened = Object.values(valves).filter(a => a.rate !== 0 && !current.open[a.name])
        if (unopened.length === 0) {
            if (current.cumulativeFlow > end) {
                end = current.cumulativeFlow
            }
        }
        for (const target of unopened) {
            for (const elTarget of unopened.filter(t => t.name !== target.name)) {
                const steps = valves[current.name].paths[target.name] + 1
                const elSteps = valves[current.elName].paths[elTarget.name] + 1
                const targetKey = `${current.time - steps}${target.name}${current.elTime - elSteps}${elTarget.name}`
                const cumulativeFlow = current.cumulativeFlow + target.rate * (current.time - steps) + elTarget.rate * (current.elTime - elSteps)
                if (current.time - steps <= 0 && current.elTime - elSteps <= 0) {
                    if (current.cumulativeFlow > end) {
                        end = current.cumulativeFlow
                        console.log(queue.length, end, current.time - steps, current.elTime - elSteps)
                    }
                } else if (!cache.get(targetKey) || cache.get(targetKey) < cumulativeFlow) {
                    cache.set(targetKey, current.cumulativeFlow)
                    queue.push({
                        time: current.time - steps,
                        elTime: current.elTime - elSteps,
                        name: target.name,
                        elName: elTarget.name,
                        open: { ...current.open, [target.name]: true, [elTarget.name]: true },
                        paths: target.paths,
                        elPaths: elTarget.paths,
                        cumulativeFlow
                    })
                }
            }

        }
    }
    console.timeEnd("Find paths")
    console.log(path)
    console.log(elPath)
    clearTimeout(timer)
    return end
}


console.time("2")
const res2 = pressureRelief2(input, true)
console.timeEnd("2")
console.log(res2)

