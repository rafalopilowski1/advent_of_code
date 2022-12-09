import { readFile } from "fs/promises";

enum Direction {
    Up = "U", Down = "D", Left = "L", Right = "R",
}

class Move {
    direction: Direction;
    amount: number;

    constructor(direction: Direction, amount: number) {
        this.direction = direction;
        this.amount = amount;
    }
}

class Node {
    currentPosition: Position;
    previousPosition: Position | null;
    next: Node | null;
    visited: Position[];
    static move(moveToDo: Move, current: Node) {
        for (let i = 0; i < moveToDo.amount; i++) {
            current.previousPosition = { ...current.currentPosition };
            switch (moveToDo.direction) {
                case Direction.Up: {
                    current.currentPosition.y += 1;
                    break;
                }
                case Direction.Down: {
                    current.currentPosition.y -= 1;
                    break;
                }
                case Direction.Left: {
                    current.currentPosition.x -= 1;
                    break;
                }
                case Direction.Right: {
                    current.currentPosition.x += 1;
                    break;
                }
            }
            if (current.visited.filter(visit => visit.x == current.currentPosition.x && visit.y == current.currentPosition.y).length == 0) current.visited.push({ ...current.currentPosition });
            if (current.next !== null) {
                let currentTemp = current;
                while (currentTemp.next !== null) {
                    Node.moveNextNodesClose(currentTemp);
                    currentTemp = currentTemp.next;
                }
            }
        }
    }
    constructor() {
        this.next = null;
        this.currentPosition = { x: 0, y: 0 };
        this.previousPosition = null;
        this.visited = [];
        this.visited.push({ ...this.currentPosition });
    }

    private static moveNextNodesClose(current: Node) {
        const xDifference = Math.abs(current.currentPosition.x - current.next.currentPosition.x);
        const yDifference = Math.abs(current.currentPosition.y - current.next.currentPosition.y);
        if (xDifference > 1 || yDifference > 1) {
            current.next.previousPosition = { ...current.next.currentPosition };
            current.next.currentPosition = { ...current.previousPosition };
            if (current.next.visited.filter(visit => visit.x == current.next.currentPosition.x && visit.y == current.next.currentPosition.y).length == 0)
                current.next.visited.push({ ...current.next.currentPosition });
        }
    }
}

interface Position {
    x: number,
    y: number,
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
let head = new Node();
const tail = new Node();
head.next = tail;
// Part 1
moves.forEach(move => Node.move(move, head));
console.log(head);
console.log("Part 1: " + tail.visited.length);

// Part 2 - faulty :( 

head = new Node();
let temp: Node = head;
for (let i = 1; i <= 10; i++) {
    temp.next = new Node();
    temp = temp.next;
}
moves.forEach(move => Node.move(move, head));
temp = head;
while (temp.next != null) {
    console.log(temp.visited.length);
    temp = temp.next;
}