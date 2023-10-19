import RouteParameters from '@arcgis/core/rest/support/RouteParameters';
import FeatureSet from '@arcgis/core/rest/support/FeatureSet.js';
import * as route from "@arcgis/core/rest/route.js";
import Graphic from '@arcgis/core/Graphic';
import findRoutes from './findStops';

const routingService = (view,origin,destination) => {
    // url to the mapping and routing service
    const routeUrl = "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";

    // create the origin and destination by clicking
    const stops = findRoutes(origin,destination);
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

    function getRoute(origin,destination,parameterOrigin,parameterDestination) {
        const routeParams = new RouteParameters({
            apiKey: "AAPK654ada81dfb94a41bebd71ff4d8f2819nvY5Wma3Hge2PT9Uy6XB14bgnNo_q1zEGBCWwTmloU6F1qtvgkiSTYiSHFlYGT5G",
            stops: new FeatureSet(),
            returnDirections: true
        });

        routeParams.stops.features.push(addGraphic(parameterOrigin, origin));
        routeParams.stops.features.push(addGraphic(parameterDestination, destination));

        route.solve(routeUrl, routeParams)
        .then(function(data) {
            data.routeResults.forEach(function(result) {
                result.route.symbol = {
                    type: "simple-line",
                    color: [5, 150, 255],
                    width: 3
                };
                view.graphics.add(result.route);
            });
        })
        .catch(function(error){
            console.log(error);
        })
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
}

export default routingService;