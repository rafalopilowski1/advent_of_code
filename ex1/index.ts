#!/usr/bin/env node

import { readFile } from 'fs';


readFile('./puzzle_input.txt', (_, data) => {
    let parsedData: String = data.toString('utf8');
    let elfData = parsedData
                            .split("\n\n")
                            .map(calories => calories
                                                     .split("\n")
                                                     .map(calorie => new Number(calorie).valueOf())
                            .reduce((a, b) => a + b))
                            .sort((a, b) => b - a);
    console.log("Result 1: " + elfData[0]);
    console.log("Result 2: " + elfData.slice(0, 3).reduce((a, b) => a + b));
});