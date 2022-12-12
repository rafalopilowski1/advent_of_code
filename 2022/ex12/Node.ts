import { NodeConnection } from "./NodeConnection";

export class Node {
    x: number;
    y: number;
    value: number;
    connections: NodeConnection[] = [];
    constructor(value: number, x: number, y: number) {
        this.x = x;
        this.y = y;
        this.value = value;
    }
    public toString = () => "Node: (x = " + this.x + ", y = " + this.y + ", value: " + (this.value == "z".charCodeAt(0) - "a".charCodeAt(0) + 1 ? "E" : this.value == -1 ? "S" : String.fromCharCode("a".charCodeAt(0) + this.value)) + ")";
}
