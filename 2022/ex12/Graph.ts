import { Node } from "./Node";

export class Graph {
    nodes: Node[] = [];
    getNodeOrCreate = (value: number, i: number, j: number): Node => {
        const foundNodes = this.nodes.filter(node => node.x == i && node.y == j);
        if (foundNodes.length == 0) {
            const tempNode: Node = new Node(value, i, j);
            this.nodes.push(tempNode);
            return tempNode;
        }
        return foundNodes[0];
    };
    minDistance = (dist: Map<Node, number>, sptSet: Map<Node, boolean>): Node => this.nodes.filter(node => !sptSet.get(node)).sort((nodeA, nodeB) => dist.get(nodeA) - dist.get(nodeB))[0];
    dijkstra = (src: Node): Map<Node, number> => {
        const distance: Map<Node, number> = new Map();
        const visitedNodes: Map<Node, boolean> = new Map();
        this.nodes.forEach(node => {
            distance.set(node, Number.POSITIVE_INFINITY);
            visitedNodes.set(node, false);
        });
        distance.set(src, 0);
        this.nodes.forEach(() => {
            const nearestNode = this.minDistance(distance, visitedNodes);
            visitedNodes.set(nearestNode, true);
            nearestNode.connections.filter(node => !visitedNodes.get(node.destNode)).forEach(node => {
                if (distance.get(nearestNode) + node.cost <= distance.get(node.destNode))
                    distance.set(node.destNode, distance.get(nearestNode) + node.cost);
            });
        });
        return distance;
    };
}
