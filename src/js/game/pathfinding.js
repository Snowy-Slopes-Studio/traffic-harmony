import { Road } from "./infras.js";
import { graphJsonToCSV } from "../lib/MRLib/graph.js";

/**
 * Get relation graph of roads and their connections
 * @param {Road[]} roads  
 * @returns {object}
 */
function getRelationGraph(buildings) {
    const graph = {};
    buildings.forEach(b => {
        if (!graph[b.id]) {
            graph[b.id] = [];
        }
        b.connections.forEach(connection => {
            graph[connection.from.id].push(connection.to.id);

        });
    });
    console.log(graphJsonToCSV(graph));
    return graph;
}

/**
 * Get the shortest route between two nodes in a graph
 * @param {object} graph 
 * @param {object} start `{x: int, y: int}`
 * @param {*} end `{x: int, y: int}`
 * @returns {string[]}
 */
function getShortestRoute(graph, start, end) {
    const visited = [];
    const queue = [[start]];
    if (start === end) {
        return [start];
    }
    while (queue.length > 0) {
        const path = queue.shift();
        const node = path[path.length - 1];
        if (!visited.includes(node)) {
            const connections = graph[node];
            for (const connection of connections) {
                const newPath = [...path, connection];
                queue.push(newPath);
                if (connection === end) {
                    return newPath;
                }
            }
            visited.push(node);
        }
    }
}


export { getRelationGraph, getShortestRoute };