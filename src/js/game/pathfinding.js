import { graphJsonToCSV } from "../lib/MRLib/graph.js";
import { areAdjacent, areSuccessivelyAdjacent } from "../lib/MRLib/coords.js";

import { Infrastructure } from "./infras.js";

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
    return graph;
}

/**
 * Get the shortest route between two nodes in a graph
 * @param {object} graph 
 * @param {object} start `{x: number, y: number}`
 * @param {object} end `{x: number, y: number}`
 * @returns {string[]}
 */
function getShortestRoute(graph, start, end) {
    const visited = [];
    const queue = [[start]];
    while (queue.length > 0) {
        const path = queue.shift();
        const node = path[path.length-1];
        if (node == end) {
            return path;
        }
        if (!visited.includes(node)) {
            visited.push(node);
            graph[node].forEach(neighbor => {
                const newPath = [...path];
                newPath.push(neighbor);
                queue.push(newPath);
            });
        }
    }
}

function isAdjacent(pos1, pos2) {
    return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y) === 1;
}

function setPathInTheRightWay(coords) {
    const middleCoords = coords.slice(1, coords.length - 1);
    const indexGraph = {};
    middleCoords.forEach((coord, index) => {
        indexGraph[index] = [];
        middleCoords.forEach((coord2, index2) => {
            if (index != index2 && isAdjacent(coord, coord2)) {
                indexGraph[index].push(index2);
            }
        });
    });
    const start = Object.keys(indexGraph).find(index => indexGraph[index].length == 1);
    const end = Object.keys(indexGraph).reverse().find(index => indexGraph[index].length == 1);
    const path = getShortestRoute(indexGraph, start, end);
    return [coords[0], ...path.map(index => middleCoords[index]), coords[coords.length - 1]];
}


export { getRelationGraph, getShortestRoute, setPathInTheRightWay };