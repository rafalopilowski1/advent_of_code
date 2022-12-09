import { readFile } from "fs/promises";

enum Direction {
    Up, Down, Left, Right
}

class Move {
    direction: Direction;
    amount: number;

    constructor(direction: Direction, amount: number) {
        this.direction = direction;
        this.amount = amount;
    }
}

class Head implements Moveable {
    "move": (moveToDo: Move) => void;
}

class Tail implements Moveable {
    "move": (moveToDo: Move) => void;
    visited: Position[];
}

interface Position {
    "x":number,
    "y":number,
}

interface Moveable {
    "move": (moveToDo: Move) => void;
}

const data = await readFile("./puzzle_input.txt");
const moves = data.toString("utf-8").split("\n").map(move => {
    const splitted = move.split(" ");
    switch (splitted[0]) {
        case "U":
            return new Move(Direction.Up, new Number(splitted[1]).valueOf());
        case "D":
            return new Move(Direction.Down, new Number(splitted[1]).valueOf());
        case "L":
            return new Move(Direction.Left, new Number(splitted[1]).valueOf());
        case "R":
            return new Move(Direction.Right, new Number(splitted[1]).valueOf());
        default:
            throw new Error("Invalid input (no direction)");
    }
});
console.log(moves);
const ropeBridge: Moveable[][] = [];

moves.forEach(move => {

});



