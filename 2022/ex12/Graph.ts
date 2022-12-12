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
    minDistance = (dist: Map<Node, number>, sptSet: Map<Node, boolean>): Node => {
        let min = Number.MAX_VALUE;
        let minNode: Node;
        this.nodes.filter(node => !sptSet.get(node)).forEach(node => {
            if (dist.get(node) <= min) {
                min = dist.get(node);
                minNode = node;
            }
        });
        return minNode;
    };

    dijkstra = (src: Node): Map<Node, number> => {
        const distance: Map<Node, number> = new Map();
        const visitedNodes: Map<Node, boolean> = new Map();
        this.nodes.forEach(node => {
            distance.set(node, Number.MAX_VALUE);
            visitedNodes.set(node, false);
        });
        distance.set(src, 0);
        this.nodes.forEach(() => {
            const nearestNode = this.minDistance(distance, visitedNodes);
            visitedNodes.set(nearestNode, true);
            nearestNode.connections.forEach((node) => {
                if (!visitedNodes.get(node.destNode) && distance.get(nearestNode) + node.cost <= distance.get(node.destNode))
                    distance.set(node.destNode, distance.get(nearestNode) + node.cost);
            });
        });
        return distance;
    };
}
