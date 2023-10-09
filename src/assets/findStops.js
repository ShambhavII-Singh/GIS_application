import data from './busStops.json';

// graph class with its methods
class Graph {
    // graph constructor
    constructor() {
        this.adjacencyList = {};
    }
    // method to add a vertex to the graph
    addVertex(vertex) {
        if (!this.adjacencyList[vertex]) {
            this.adjacencyList[vertex] = [];
        }
    }
    // method to add an edge to the graph
    addEdge(source, destination) {
        this.addVertex(source);
        this.addVertex(destination);
        // this graph is directed form origin to destination
        this.adjacencyList[source].push(destination);
    }
    // methos to remove an edge from the graph
    removeEdge(source, destination) {
        this.adjacencyList[source] = this.adjacencyList[source].filter(vertex => vertex !== destination);
    }
    // method to return graph json object directly
    graph() {
        return this.adjacencyList;
    }
}

// returns the number of bus stops in each quadrant
const findEnder = (quadrant) => {
    quadrant = Math.floor(quadrant/100);
    if (quadrant===1) {
        return 6;
    }
    if (quadrant===2) {
        return 14;
    }
    if (quadrant===3) {
        return 9;
    }
    if (quadrant===4) {
        return 10;
    }
}