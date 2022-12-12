import { Node } from "./Node";


export interface NodeConnection {
    destNode: Node;
    cost: number;
}
