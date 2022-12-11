import { Direction } from "./Direction";
import { Move } from "./Move";
import { Position } from "./Position";

export class Node {
    currentPosition: Position;
    previousPosition: Position | null;
    next: Node | null;
    visited: Position[];
    static nodeLength = 0;
    static move(moveToDo: Move, current: Node) {
        for (let i = 0; i < moveToDo.amount; i++) {
            current.previousPosition = { ...current.currentPosition };
            Node.makeMove(moveToDo, current);
            if (current.visited.filter(visit => visit.x == current.currentPosition.x && visit.y == current.currentPosition.y).length == 0)
                current.visited.push({ ...current.currentPosition });
            if (current.next !== null) {
                let currentTemp = current;
                while (currentTemp.next !== null) {
                    Node.moveNextNodesClose(currentTemp, moveToDo);
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
    getAt(index: number): Node {
        let temp: Node;
        for (let i = 0; i < index; i++) {
            if (temp === undefined) {
                temp = this.next;
            } else if (temp.next !== undefined) {
                temp = temp.next;
            } else {
                throw new Error("Index out of bounds");
            }
        }
        return index == 0 ? this : temp;
    }
    setNext(next: Node) {
        this.next = next;
        Node.nodeLength++;
    }
    private static makeMove(moveToDo: Move, current: Node) {
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
    }

    private static moveNextNodesClose(current: Node, movement: Move) {
        const xDiff = current.currentPosition.x - current.next.currentPosition.x;
        const xDiffAbs = Math.abs(xDiff);
        const yDiff = current.currentPosition.y - current.next.currentPosition.y;
        const yDiffAbs = Math.abs(yDiff);
        if (xDiffAbs > 1 || yDiffAbs > 1) {
            if (Math.pow(xDiffAbs, 2) + Math.pow(yDiffAbs, 2) > 2) {
                if (xDiff > 0) {
                    Node.makeMove(new Move(Direction.Right, 1), current.next);
                }
                if (xDiff < 0) {
                    Node.makeMove(new Move(Direction.Left, 1), current.next);
                }
                if (yDiff > 0) {
                    Node.makeMove(new Move(Direction.Up, 1), current.next);
                }
                if (yDiff < 0) {
                    Node.makeMove(new Move(Direction.Down, 1), current.next);
                }
            } else {
                Node.makeMove(movement, current.next);
            }
            if (current.next.visited.filter(visit => visit.x == current.next.currentPosition.x && visit.y == current.next.currentPosition.y).length == 0)
                current.next.visited.push({ ...current.next.currentPosition });
        }
    }
}
