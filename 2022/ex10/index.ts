import { readFile } from "fs/promises";

interface Tick {
    iteration: number,
    registerValue: number,
    command: string,
    signal_strength: number,
}

const data = await readFile("./puzzle_input.txt");
const parsedCommands = data.toString("utf-8").split("\n").flatMap(line => line.split(" "));
let register = 1;
let counter = 0;
let numberPresent = false;
const tickHistory: Tick[] = [];
parsedCommands.forEach(command => {
    counter++;
    if (numberPresent) {
        tickHistory.push({ iteration: counter, registerValue: register, command: command, signal_strength: counter * register });
        register += new Number(command).valueOf();
        numberPresent = false;
    }
    else {
        numberPresent = command == "addx";
        tickHistory.push({ iteration: counter, registerValue: register, command: command, signal_strength: counter * register });
    }
});
// Part 1
const sum = tickHistory
    .filter(tick => tick.iteration == 20 || (tick.iteration + 20 != 0 && (tick.iteration + 20) % 40 == 0))
    .map(tick => tick.signal_strength)
    .reduce((a, b) => a + b);
console.log("Part 1: " + sum);

// Part 2
const crtChars: string[] = [];
for (let i = 0; i < tickHistory.length; i++) {
    if ((i % 40) + 1 >= tickHistory[i].registerValue && (i % 40) - 1 <= tickHistory[i].registerValue) {
        crtChars.push("#");
    } else {
        crtChars.push(".");
    }
}
const crtMonitor: string[] = [];
for (let x = 1; x <= 6; x++) {
    crtMonitor.push(crtChars.slice((x - 1) * 40, x * 40).join(""));
}
console.log("Part 2: ");
for (const row of crtMonitor) {
    console.log(row);
}
