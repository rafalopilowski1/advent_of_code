import { Direction } from "./Direction";

export class Move {
    direction: Direction;
    amount: number;

    constructor(direction: Direction, amount: number) {
        this.direction = direction;
        this.amount = amount;
    }
    static getMove(move: string) {
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
    }
}
