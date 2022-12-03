#!/usr/bin/env node

import { readFile } from "fs";

// Part 1
readFile("./puzzle_input.txt", (_, data) => {
    let score = data
        // File to String
        .toString("utf-8")
        // String to Lines
        .split("\n")
        // Lines of String to Lines of Chars
        .map((line) => line.split(""))
        // Lines of Chars to Chars shared in each two halves
        .flatMap((chars) =>
            [...new Set(chars.slice(0, chars.length / 2))].filter((char) =>
                [...new Set(chars.slice(chars.length / 2, chars.length))].includes(char)
            )
        )
        // Chars to numbers
        .map((char) =>
            char >= "a" && char <= "z"
                ? char.charCodeAt(0) - "a".charCodeAt(0) + 1
                : char >= "A" && char <= "Z"
                    ? char.charCodeAt(0) - "A".charCodeAt(0) + 27
                    : 0
        )
        // Numbers sumed up
        .reduce((a, b) => a + b);

    console.log("Part 1: " + score);
});

// Part 2
readFile("./puzzle_input.txt", (_, data) => {
    // File to lines
    let parsedDataLines = data.toString("utf-8").split("\n");
    // Lines to Elf Groups
    let elfGroups: String[][][] = [];
    for (let i = 3; i <= parsedDataLines.length; i += 3) elfGroups.push(parsedDataLines.slice(i - 3, i).map((line) => line.split("")));

    let score = elfGroups
        // Groups to Char badges
        .flatMap((group) =>
            [...new Set(group[0])]
                .filter((char) => [...new Set(group[1])].includes(char))
                .filter((char) => [...new Set(group[2])].includes(char))
        )
        // Chars to numbers
        .map((char) =>
            char >= "a" && char <= "z"
                ? char.charCodeAt(0) - "a".charCodeAt(0) + 1
                : char >= "A" && char <= "Z"
                    ? char.charCodeAt(0) - "A".charCodeAt(0) + 27
                    : 0
        )
        // Numbers sumed up
        .reduce((a, b) => a + b);

    console.log("Part 2: " + score);
});

