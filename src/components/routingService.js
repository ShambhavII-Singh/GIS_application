import RouteParameters from '@arcgis/core/rest/support/RouteParameters';
import FeatureSet from '@arcgis/core/rest/support/FeatureSet.js';
import * as route from "@arcgis/core/rest/route.js";
import Graphic from '@arcgis/core/Graphic';
import findRoutes from './findStops';

const routingService = (view,origin,destination) => {
    
    // url to the mapping and routing service
    const routeUrl = "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";

    // create the origin and destination by clicking
    const object = findRoutes(origin,destination);
    const stops = object[0];
    const stats = object[1];

    // add the stop symbol to the map
    const addGraphic = (type, point) => {
        const graphic = new Graphic({
            symbol: {
                type: "simple-marker",
                color: (type === "origin") ? 
                "white" : (type === "destination") ?
                "black" : (type === "intermediate") ? 
                "red" : null,
                size: "8px"
            },
            geometry: point
        });
        view.graphics.add(graphic);
        return graphic;
    }

    // routing service
    const routeParams = new RouteParameters({
        apiKey: "AAPK654ada81dfb94a41bebd71ff4d8f2819nvY5Wma3Hge2PT9Uy6XB14bgnNo_q1zEGBCWwTmloU6F1qtvgkiSTYiSHFlYGT5G",
        stops: new FeatureSet(),
        returnDirections: false,
        accumulateAttributes: ["kilometers"],
        restrictUTurns: "no-backtrack",
        geometryPrecision: null
    });

    // show the route on the map
    function getRoute(origin,destination,parameterOrigin,parameterDestination) {
        
        routeParams.stops.features.push(addGraphic(parameterOrigin, origin));
        routeParams.stops.features.push(addGraphic(parameterDestination, destination));
        
        route
        .solve(routeUrl, routeParams)
        .then(function(data) {
            data.routeResults.forEach(function(result) {             
                result.route.symbol = {
                    type: "simple-line",
                    color: "#F40505",
                    width: 3
                };
                // zoom to the route shown
                view.goTo(result.route.geometry);
                // add the route grahics
                view.graphics.add(result.route);
            });
        })
        .catch(function(error){
            console.log(error);
        })
    }

    // show the route statistics
    const showStatistics = (stats) => {
        const script = document.createElement("script");
        script.setAttribute("type","text/plain");
        script.setAttribute("id","label-expression");
        script.innerHTML = "return Concatenate([$feature.name,Round($feature.PMAvg)],TextFormatting.NewLine);";

        const statistics = document.createElement("div");
        statistics.classList = "esri-widget esri-widget--panel";
        statistics.style.width = "100%";
        statistics.style.marginTop = "0";
        statistics.style.padding = "15px";
        statistics.style.fontSize = "14px"
        statistics.style.boxShadow = "0 1px 4px rgba(0, 0, 0, .8)"

        const heading = document.createElement("h3");
        heading.innerHTML = "Route Statistics";
        statistics.appendChild(heading);

        const table = document.createElement("div");
        table.style.lineHeight = "25px";
        table.innerHTML = `<style>
                                th {
                                    border-right: 1px solid black;
                                    padding: 0 10px 0 0;
                                }
                                td {
                                    padding: 0 0 0 10px;
                                }
                        </style>
                        <table>
                            <tr>
                                <th>Starting Point</th>
                                <td>${stats.places.origin}</td>
                            </tr>
                            <tr>
                                <th>Destination Point</th>
                                <td>${stats.places.destination}</td>
                            </tr>
                            <tr>
                                <th>Average PM2.5</th>
                                <td>${Number(stats.info.average).toFixed(3)}</td>
                            </tr>
                            <tr>
                                <th>Maximum PM2.5</th>
                                <td>${Number(stats.highest.aqi).toFixed(3)}</td>
                            </tr>
                            <tr>
                                <th>Most Polluted</th>
                                <td>${stats.highest.name}</td>
                            </tr>
                            <tr>
                                <th>Health rating</th>
                                <td>${stats.info.rating}</td>
                            </tr>
                        </table>`
        statistics.appendChild(table);
        return statistics;
    }

    for (let i = 0; i < stops.length-1; i++) {
        let parameterDestination,parameterOrigin;
        parameterDestination = "intermediate";
        parameterOrigin = "intermediate";
        if (i===0) {
            parameterOrigin = "origin";
        }
        if (i+1===stops.length-1) {
            parameterDestination = "destination";
        }
        getRoute(stops[i],stops[i+1],parameterOrigin,parameterDestination); // Call the route service
    }    

    if (origin!==destination) {
        view.ui.add(showStatistics(stats), "bottom-right");
    }
}

export default routingService;