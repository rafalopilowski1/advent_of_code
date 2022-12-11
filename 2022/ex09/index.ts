import { readFile } from "fs/promises";
import { Move } from "./Move";
import { Node } from "./Node";

const data = await readFile("./puzzle_input.txt");
const moves = data.toString("utf-8").split("\n").map(move => Move.getMove(move));

// Part 1
let head = new Node();
const tail = new Node();
head.next = tail;
moves.forEach(move => Node.move(move, head));
console.log("Part 1: " + tail.visited.length);

// Part 2 - working :) 
head = new Node();
let temp: Node = head;
for (let i = 1; i <= 10; i++) {
    temp.setNext(new Node());
    temp = temp.next;
}
moves.forEach(move => Node.move(move, head));
temp = head.getAt(Node.nodeLength);
console.log("Part 2: " + temp.visited.length);


