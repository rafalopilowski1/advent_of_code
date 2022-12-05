#!/usr/bin/env node

import { readFile } from "fs";
import cloneDeep from "lodash.clonedeep";
import { Move } from "./Move";

readFile("./puzzle_input.txt", (_, data) => {
    const lines = data
        .toString("utf-8")
        .split("\n");
    const splitIndex = lines
        .indexOf("");
    // Table of queues
    let queueTable = lines
        .slice(0, splitIndex)
        .map(line => [...line.matchAll(/\[\w\] ?| \d  ?| {3,4}/g)]
            .map(array => array[0])
        );
    // Traverse the table
    queueTable = queueTable[0]
        .map((_, colIndex) => queueTable
            .map(row => row[colIndex])
        );
    // Queue map for part 1
    const queueMapSource1 = new Map(queueTable
        .map(queue => queue
            .map(value => value.trim())
            .filter(value => value.length != 0)
            .map(value => value.replace("[", "").replace("]", ""))
        )
        .map(queue => [new Number(queue[queue.length - 1]).valueOf(), queue.slice(0, queue.length - 1).reverse()]));
    // Queue map for part 2 (uses `lodash` for deep cloning)
    const queueMapSource2 = cloneDeep(queueMapSource1);
    // Array of moves
    const movesArray = lines
        .slice(splitIndex + 1, lines.length)
        .map(line => line.split(" "))
        .map(array => array
            .filter(value => value.match("\\d"))
            .map(number => new Number(number).valueOf())
        )
        .map(array => new Move({ amount: array[0], startQueue: array[1], endQueue: array[2] }));

    // Part 1
    movesArray.forEach(move => {
        const array = queueMapSource1.get(move.startQueue);
        const toPush = array.slice(array.length - move.amount, array.length);
        array.splice(array.length - move.amount, move.amount);
        queueMapSource1.set(move.startQueue, array);
        queueMapSource1.set(move.endQueue, queueMapSource1.get(move.endQueue).concat(toPush.reverse()));
    });
    console.log("Part 1: " + [...queueMapSource1.values()].map(array => array[array.length - 1]).reduce((acc, value) => acc + value));

    // Part 2
    movesArray.forEach(move => {
        const array = queueMapSource2.get(move.startQueue);
        const toPush = array.slice(array.length - move.amount, array.length);
        array.splice(array.length - move.amount, move.amount);
        queueMapSource2.set(move.startQueue, array);
        queueMapSource2.set(move.endQueue, queueMapSource2.get(move.endQueue).concat(toPush));
    });
    console.log("Part 2: " + [...queueMapSource2.values()].map(array => array[array.length - 1]).reduce((acc, value) => acc + value));
});