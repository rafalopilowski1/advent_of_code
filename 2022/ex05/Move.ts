interface MoveArgs {
    amount: number;
    startQueue: number;
    endQueue: number;
}
export class Move {
    amount: number;
    startQueue: number;
    endQueue: number;
    constructor({ amount, startQueue, endQueue }: MoveArgs) {
        this.amount = amount;
        this.startQueue = startQueue;
        this.endQueue = endQueue;
    }
}
