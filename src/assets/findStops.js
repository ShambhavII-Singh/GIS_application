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

// returns how many bus stops are present in the quadrnts preceeding
const cumilativeEnder = (quadrant) => {
    quadrant = Math.floor(quadrant/100);
    if (quadrant===1) {
        return 0;
    }
    if (quadrant===2) {
        return 6;
    }
    if (quadrant===3) {
        return 20;
    }
    if (quadrant===4) {
        return 29;
    }
}

// returns all the bus stops that would be encountered between the origin and destination
const findStops = (origin,destination) => {
    const answer = [];
    var i;
    // when both the origin and the destination are in the same quadrant
    if (Math.floor(origin/100)===Math.floor(destination/100)) {
        if (destination>origin) {
            for (i=origin;i<=destination;i++) {
                answer.push(i);
            }
        }
        else {
            for (i=origin;i>=destination;i--) {
                answer.push(i);
            }
        }
        return answer;
    }
    // when the origin is in a lower quadrant
    if (origin<destination) {
        for (i=origin;i<origin-(origin%100)+findEnder(origin);i++) {
            answer.push(i);
        }
        for (i=destination-(destination%100);i<=destination;i++) {
            answer.push(i);
        }
        return answer;
    }
    // when the origin is in a higher quadrant
    if (origin>destination) {
        for (i=origin;i>=origin-(origin%100);i--) {
            answer.push(i);
        }
        for (i=destination-(destination%100);i<=destination;i++) {
            answer.push(i);
        }
        return answer;
    }
}

// returns the index where the data of particular quadrant is in the json file
const findIndex = (quadrant) => {
    return cumilativeEnder(quadrant)+(quadrant%100);
}

// returns the graph required for the origin and destination and the PM rating of each vertex
const createNetwork = (origin,destination) => {
    const network = new Graph();
    const stops = findStops(origin,destination);
    var ratings={};
    var i;
    var j;
    for (i=0;i<stops.length;i++) {
        ratings[stops[i]] = data[findIndex(stops[i])].PMAvg;
    }
    for (i=0;i<stops.length;i++) {
        for (j=0;j<stops.length;j++) {
            if (i!==j) {
                network.addEdge(stops[i],stops[j]);
            }
        }
    }
    network.removeEdge(origin,destination);
    return [network.graph(),ratings];
}

