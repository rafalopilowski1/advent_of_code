import { readFile } from "fs";

function find_marker(chars: string[], windowSize: number): number {
    for (let i = windowSize; i < chars.length; i++) {
        const window = chars.slice(i - windowSize, i);
        const windowSet = new Set(window);
        if (window.length == windowSet.size) {
            return i;
        }
    }
}

readFile("./puzzle_input.txt", (_, data) => {
    const parsedData = data.toString("utf-8");
    const chars = parsedData.split("");
    // Start marker (part 1)
    const startIndex = find_marker(chars, 4);
    console.log("Part 1: " + startIndex);
    // Message marker
    const messageIndex = find_marker(chars, 14);
    console.log("Part 2: " + messageIndex);
});