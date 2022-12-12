import { readFile } from "fs/promises";
import { Graph } from "./Graph";

const data = await readFile("./puzzle_input.txt");

const climbingField: number[][] = data
    .toString("utf-8")
    .split("\n")
    .map(line => line
        .split("")
        .map(field => field == "S" ? -1 : field == "E" ? (("z".charCodeAt(0) - "a".charCodeAt(0)) + 1) : field.charCodeAt(0) - "a".charCodeAt(0))
    );

// Doing Shortest-Path on Graph
const graph = new Graph();

// Adding paths into graph
for (let i = 0; i < climbingField.length; i++) {
    for (let j = 0; j < climbingField[i].length; j++) {
        const element = climbingField[i][j];
        const tempNode = graph.getNodeOrCreate(element, i, j);
        if (i - 1 >= 0) {
            const cost1 = climbingField[i - 1][j] - element;
            if (cost1 <= 1) {
                const tempNode1 = graph.getNodeOrCreate(climbingField[i - 1][j], i - 1, j);
                tempNode.connections.push({ destNode: tempNode1, cost: 1 });
            }
        }
        if (i + 1 < climbingField.length) {
            const cost2 = climbingField[i + 1][j] - element;
            if (cost2 <= 1) {
                const tempNode1 = graph.getNodeOrCreate(climbingField[i + 1][j], i + 1, j);
                tempNode.connections.push({ destNode: tempNode1, cost: 1 });
            }
        }
        if (j - 1 >= 0) {
            const cost3 = climbingField[i][j - 1] - element;
            if (cost3 <= 1) {
                const tempNode1 = graph.getNodeOrCreate(climbingField[i][j - 1], i, j - 1);
                tempNode.connections.push({ destNode: tempNode1, cost: 1 });
            }
        }
        if (j + 1 < climbingField[i].length) {
            const cost4 = climbingField[i][j + 1] - element;
            if (cost4 <= 1) {
                const tempNode1 = graph.getNodeOrCreate(climbingField[i][j + 1], i, j + 1);
                tempNode.connections.push({ destNode: tempNode1, cost: 1 });
            }
        }
    }
}

const endNode = graph.nodes.find(node => node.value == (("z".charCodeAt(0) - "a".charCodeAt(0)) + 1));

// Part 1
const firstNode = graph.nodes.find(node => node.value == -1);
console.log("Part 1: " + graph.dijkstra(firstNode).get(endNode));

// Part 2
const firstNodes = graph.nodes.filter(node => node.value == 1).flatMap(node => node.connections.map(conn => conn.destNode).filter(node => node.value == 0));
const dists = [];
for (const firstNode of firstNodes) {
    dists.push(graph.dijkstra(firstNode).get(endNode));
}
console.log("Part 2: " + dists.sort((a, b) => a - b)[0]);
