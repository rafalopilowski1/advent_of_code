import { readFile } from "fs/promises";

const data = await readFile("./puzzle_input.txt");

const treeGrid: number[][] = data
    .toString("utf-8")
    .split("\n")
    .map(line => line
        .split("")
        .map(num => new Number(num)
            .valueOf()));

// Part 1
const visibilityMap: boolean[][] = [];

for (let i = 0; i < treeGrid.length; i++) {
    for (let j = 0; j < treeGrid[i].length; j++) {
        let top = true;
        let bottom = true;
        let left = true;
        let right = true;
        const tree = treeGrid[i][j];
        // Top
        for (let t = i - 1; t >= 0; t--) {
            if (treeGrid[t][j] >= tree) {
                top = false;
                break;
            }
        }
        // Bottom
        for (let b = i + 1; b < treeGrid.length; b++) {
            if (treeGrid[b][j] >= tree) {
                bottom = false;
                break;
            }
        }
        // Left
        for (let l = j - 1; l >= 0; l--) {
            if (treeGrid[i][l] >= tree) {
                left = false;
                break;
            }
        }
        // Right
        for (let r = j + 1; r < treeGrid[i].length; r++) {
            if (treeGrid[i][r] >= tree) {
                right = false;
                break;
            }
        }
        if (visibilityMap[i] === undefined) visibilityMap[i] = [];
        visibilityMap[i][j] = top || bottom || left || right;
    }
}

const visibleTrees = visibilityMap.flatMap(line => line.map(isVisible => new Number(isVisible).valueOf())).reduce((a, b) => a + b);
console.log("Visible trees: " + visibleTrees);

// Part 2
const viewMap: number[][] = [];

for (let i = 0; i < treeGrid.length; i++) {
    for (let j = 0; j < treeGrid[i].length; j++) {
        let top = 0;
        let bottom = 0;
        let left = 0;
        let right = 0;
        const tree = treeGrid[i][j];
        // Top
        for (let t = i - 1; t >= 0; t--) {
            top++;
            if (treeGrid[t][j] >= tree) break;
        }
        // Bottom
        for (let b = i + 1; b < treeGrid.length; b++) {
            bottom++;
            if (treeGrid[b][j] >= tree) break;
        }
        // Left
        for (let l = j - 1; l >= 0; l--) {
            left++;
            if (treeGrid[i][l] >= tree) break;
        }
        // Right
        for (let r = j + 1; r < treeGrid[i].length; r++) {
            right++;
            if (treeGrid[i][r] >= tree) break;
        }
        if (viewMap[i] === undefined) viewMap[i] = [];
        viewMap[i][j] = top * bottom * left * right;
    }
}
const bestView = viewMap.flatMap(line => line).sort((a, b) => b - a)[0];
console.log("Best view distance: " + bestView);