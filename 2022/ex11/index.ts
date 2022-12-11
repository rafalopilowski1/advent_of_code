import { readFile } from "fs/promises";
import { Monkey, OperationType } from "./Monkey";

const data = await readFile("./puzzle_input.txt");

const reduntantWords = ["new", "divisible", "by", "throw", "to", "monkey", "true", "false", "Starting"];

const monkeysData = Array.from(data.toString("utf-8").matchAll(/[\d\w*+]+/g)).map(match => match[0]).filter(word => !reduntantWords.includes(word));

// Part 1 : 20 rounds
Monkey.parseMonkeys(monkeysData, OperationType.Normal);
for (let i = 0; i < 20; i++) {
    for (const monkey of Monkey.allMonkeys) {
        monkey.doWork();
    }
}
console.log("Part 1: " + Monkey.allMonkeys.map(monkey => monkey.inspectCounter).sort((a, b) => b - a).slice(0, 2).reduce((a, b) => a * b));

Monkey.allMonkeys = [];

// Part 2 : 10000 rounds
Monkey.parseMonkeys(monkeysData, OperationType.Reduced);
for (let i = 0; i < 10000; i++) {
    for (const monkey of Monkey.allMonkeys) {
        monkey.doWork();
    }
}
console.log("Part 2: " + Monkey.allMonkeys.map(monkey => monkey.inspectCounter).sort((a, b) => b - a).slice(0, 2).reduce((a, b) => a * b));


