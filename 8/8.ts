import { getInputAsArray } from "../fs";

const input = getInputAsArray(__dirname);


const matrix = input.map(a => a.split(""));

const testResult = matrix.reduce((result, xAxis, yIndex, testMatrix) => {
    const count = xAxis.reduce((count, treeString, xIndex) => {
            const tree = parseInt(treeString)
            let visibleX = true;
            let visibleXr = true;
            let visibleY = true;
            let visibleYd = true;
            for (let i = 0; i < xIndex; i += 1) {
                if (parseInt(testMatrix[yIndex][i]) >= tree) {
                    visibleX = false
                }
            }
            for (let i = xIndex + 1; i <= testMatrix[0].length - 1; i += 1) {
                if (parseInt(testMatrix[yIndex][i]) >= tree) {
                    visibleXr = false
                }
            }
            for (let i = 0; i < yIndex; i += 1) {

                if (parseInt(testMatrix[i][xIndex]) >= tree) {
                    visibleY = false
                }
            }
            for (let i = yIndex + 1; i <= testMatrix[0].length - 1; i += 1) {
                if (parseInt(testMatrix[i][xIndex]) >= tree) {
                    visibleYd = false
                }
            }

            return visibleX || visibleY || visibleXr || visibleYd ? count += 1 : count
    }, 0)
    return result += count
}, 0)

console.log("test", testResult)

const testResult2 = matrix.reduce((result, xAxis, yIndex, testMatrix) => {
    const count = xAxis.reduce((count, treeString, xIndex) => {
            const tree = parseInt(treeString)
            let visibleX = 0;
            let visibleXr = 0;
            let visibleY = 0;
            let visibleYd = 0;
            for (let i = xIndex - 1; i >= 0; i -= 1) {
                visibleX += 1
                if (parseInt(testMatrix[yIndex][i]) >= tree) {
                    break
                }

            }
            for (let i = xIndex + 1; i <= testMatrix[0].length - 1; i += 1) {
                visibleXr += 1
                if (parseInt(testMatrix[yIndex][i]) >= tree) {
                    break
                }
            }
            for (let i = yIndex - 1; i >= 0; i -= 1) {
                visibleY += 1
                if (parseInt(testMatrix[i][xIndex]) >= tree) {
                    break
                }
            }
            for (let i = yIndex + 1; i <= testMatrix[0].length - 1; i += 1) {
                visibleYd += 1
                if (parseInt(testMatrix[i][xIndex]) >= tree) {
                    break
                }
            }

            const visibility = visibleX * visibleY * visibleXr * visibleYd

            return visibility > count ? visibility : count
    }, 0)
    return result > count ? result : count
}, 0)

console.log("visibility", testResult2)

let visible = 0;

console.log(matrix.length * matrix[0].length)

console.time("8/1")
for (let y = 0; y < matrix.length; y += 1) {
    for (let x = 0; x < matrix[0].length; x += 1) {
        const tree = parseInt(matrix[x][y]);
        let visibleX = true;
        let visibleY = true;
        if (x < 50) {
            for (let i = 0; i < matrix[0].length / 2; i += 1) {
                if (parseInt(matrix[i][x]) >= tree) {
                    visibleX = false
                    break
                }
            }
        } else {
            for (let i = 50; i > matrix[0].length  - 1; i += 1) {
                if (parseInt(matrix[i][x]) >= tree) {
                    visibleX = false
                    break
                }
            } 
        }
        if (y < 50) {
            for (let i = 0; i < matrix[x].length / 2; i += 1) {
                if (parseInt(matrix[y][i]) >= tree) {
                    visibleX = false
                    break
                }
            }
        } else {
            for (let i = 50; i < matrix[x].length - 1; i += 1) {
                if (parseInt(matrix[y][i]) >= tree) {
                    visibleX = false
                    break
                }
            } 
        }
        if (visibleX || visibleY) {
             visible += 1
         }
    }
}
console.time("8/2")

console.log(`Visible trees: ${visible}`)