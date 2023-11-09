import data from '../assets/json/busStops.json';

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
        this.adjacencyList[source] = this.adjacencyList[source]?.filter(vertex => vertex !== destination);
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

// point class and its method
class Point {
    constructor(longitude,latitude) {
        this.object = {};
        this.object["type"] = "point";
        this.object["longitude"] = longitude;
        this.object["latitude"] = latitude;
    }
    point() {
        return this.object;
    }
}

// returns point objects for an array of stops
const findCoordinates = (stops) => {
    const answer = [];
    for (var i=0;i<stops.length;i++) {
        const object = data[findIndex(stops[i])];
        const point = new Point(object.coordinates[0],object.coordinates[1]).point();
        answer.push(point);
    }
    return answer;
}

// returns geoJSON object for an array of stops
const geojsonObject = (stops) => {
    var geoJson = {
        "type": "FeatureCollection",
        "features": []
    }
    for (var i=0;i<stops.length;i++) {
        const object = data[findIndex(stops[i])];
        const feature = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": object.coordinates
            },
            "properties": {
                "name": object.name,
                "PMAvg": object.PMAvg,
            }
        };
        geoJson.features.push(feature);
    }
    return geoJson;
}

// route class and its method
class Route {
    constructor(places,info,highest) {
        this.object = {};
        this.object["places"] = places;
        this.object["info"] = info;
        this.object["highest"] = highest;
    }
    route() {
        return this.object;
    }
}

// returns statistics for an array of stops
const routeStatistics = (stops) => {
    var sum = 0;
    var maximum = 0;
    for (var i=0;i<stops.length;i++) {
        const object = data[findIndex(stops[i])];
        sum += object.PMAvg;
        if (data[findIndex(stops[maximum])].PMAvg < object.PMAvg) {
            maximum = i;
        } 
    }  
    var rating;
    const average = sum/stops.length;
    if (average>=0 && average<=100) {
        rating = 5;
    }
    if (average>=101 && average<=200) {
        rating = 4;
    }
    else if (average>=201 && average<=300) {
        rating = 3;
    }
    if (average>=301 && average<=400) {
        rating = 2;
    }
    if (average>=401 && average<=500) {
        rating = 1;
    }
    const places = {"origin": data[findIndex(stops[0])].name, "destination": data[findIndex(stops[stops.length-1])].name}
    const info = {"average" : average, "rating" : rating};
    const highest = {"name" : data[findIndex(stops[maximum])].name, "aqi" : data[findIndex(stops[maximum])].PMAvg};
    const answer = new Route(places,info,highest).route();
    return answer;
}

// returns the graph required for the origin and destination and the PM rating of each vertex
const createNetwork = (origin,destination) => {
    const network = new Graph();
    const stops = findStops(origin,destination);
    var ratings={};
    var i;
    var j;
    for (i=0;i<stops.length;i++) {
        ratings[stops[i]] = data[findIndex(stops[i])]?.PMAvg;
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

// returns the quadrants of the optimized route
const findRoutes = (origin,destination) => {
    var answer = [];
    if (!origin && !destination) {
        return answer;
    }
    else {
        if (!origin) {
            answer.push(destination);
            return answer;
        }
        if (!destination) {
            answer.push(origin);
            return answer;
        }
    }
    if (origin===destination) {
        answer.push(destination);
    }
    const object = createNetwork(origin,destination);
    const web = object[0];
    const pollution = object[1];
    var current = origin;
    var i;
    while (current!==destination) {
        // if the new stop already exists in the route then this means that the route is circling
        if (answer.includes(current)) {
            answer.push(destination);
            break;
        }
        answer.push(current);
        var minimum = Number.POSITIVE_INFINITY;
        const array = web[current];
        var addition = current;
        for (i=0;i<array.length;i++) {
            if (pollution[array[i]]<minimum) {
            minimum = pollution[array[i]];
            addition = array[i];
            }
        }
        current = addition;
    }
    return [findCoordinates(answer),routeStatistics(answer),geojsonObject(answer)];
}

export default findRoutes;
