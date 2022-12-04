#!/usr/bin/env node

import { readFile } from "fs";


readFile('./puzzle_input.txt', (_, data) => {
    let result = data
        .toString('utf-8')
        .split('\n')
        .map(line => line
            .split(',')
            .map(group => group
                .split('-')
                .map(number => new Number(number).valueOf()))
            .sort((a, b) => (b[1] - b[0]) - (a[1] - a[0]))
        )
        .filter(group => group[0][0] <= group[1][0] && group[0][1] >= group[1][1]).length;
    console.log("Redundant pairs: " + result);
});
readFile('./puzzle_input.txt', (_, data) => {
    let result = data
        .toString('utf-8')
        .split('\n')
        .map(line => line
            .split(',')
            .map(group => group
                .split('-')
                .map(number => new Number(number).valueOf()))
            .sort((a, b) => (a[0]) - (b[0]))
        )
        .filter(group => group[1][0] >= group[0][0] && group[0][1] >= group[1][0]).length;
    console.log("Overlapping result: " + result);
});