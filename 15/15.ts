import { getInput } from "../fs"

const input = getInput(__dirname)

const getSensorList = (input: string) => {
    const arr = input.split("\n")
    const sensors = arr.map(a => {
        const words = a.split((" ")).map(a => a.split("=")[1])
        const sensorX = Number(words[2].replace(",", ""))
        const sensorY = Number(words[3].replace(":", ""))
        const beaconX = Number(words.at(-2)?.replace(",", ""))
        const beaconY = Number(words.at(-1))
        const rangeX = Math.abs(beaconX - sensorX)
        const rangeY = Math.abs(beaconY - sensorY)
        const sensorMaxRange = rangeX + rangeY
        return { sensorX, sensorY, beaconX, beaconY, rangeX, rangeY, sensorMaxRange }
    })
    return sensors
}

const findBeacons = (input: string) => {
    const sensors = getSensorList(input)
    const maxX = Math.max(...sensors.map(a => a.beaconX))
    const row = 2000000
    let covered = 0
    for (let i = -16219600; i <= maxX + 1000000; i++) {
        let scanned = false
        let isBeacon = false
        let isSensor = false
        sensors.forEach(sensor => {
            const beaconX = Math.abs(sensor.beaconX - sensor.sensorX)
            const beaconY = Math.abs(sensor.beaconY - sensor.sensorY)
            const pointX = Math.abs( i - sensor.sensorX)
            const pointY = Math.abs( row - sensor.sensorY)
            const sensM = beaconX + beaconY
            const pointM = pointX + pointY

            if (sensM >= pointM) {
                scanned = true
            }
            if (sensor.beaconX === i && sensor.beaconY === row) {
                isBeacon = true
            }
            if (sensor.sensorX === i && sensor.sensorY === row) {
                isSensor = true
            }
        })
        covered += scanned && !isBeacon && !isSensor ? 1 : 0
    }
    return covered
 
}
console.time("1")
console.log(findBeacons(input))
console.timeEnd("1")

const findBeacons2 = (input: string) => {
    const sensors = getSensorList(input)
    const maxCoord = 4_000_000
    for (let row = 0; row < maxCoord; row++) {
        const scannedRanges: number[][] = []
        sensors.forEach(sensor => {
            if (Math.abs(sensor.sensorY - row) > sensor.sensorMaxRange) {
                return
            } else {
                const manh = Math.abs(sensor.sensorMaxRange - Math.abs(sensor.sensorY - row))
                scannedRanges.push([sensor.sensorX - manh, sensor.sensorX + manh])
            }
        })
        let res;
        scannedRanges.sort((r, b) => r[0] - b[0]).reduce((a, b) => {
            if (b[0] > a + 1) {
                res = (a + 1) * 4000000 + row
            }
            return b[1] > a ? b[1] : a
        }, 0)
        if (res) {
            // found result, log it and break
            console.log(res)
            break
        }
    }
}

console.time("2")
findBeacons2(input)
console.timeEnd("2")
